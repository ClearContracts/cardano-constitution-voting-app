import environments from "@constants/environments";

//@ts-ignore
const blockfrostApiUrl = 'https://cardano-'+(environments.networkId == 0? 'preview':'mainnet')+'.blockfrost.io/api/v0/txs/';
const blockfrostApiKey = environments.blockfrostApiKey;


interface OnChainVoteData {
  [delegate: string]: string[];
}

export type SummaryTxMetadata =  {
  votes: {
    yes: number,
    no: number,
    abstain: number
  }
  eligibleVoters: number,
  approvalPercent: number
  voteTransactions: string[],
  pollName: string,
  constutionHash: string
}

export type Vote = VotePayload  & {
  voterName: string
  cosesign1: string
  cosekey: string
}

export interface VotePayload{
  pollName: string,
  constutionHash: string,
  constutionLink: string,
  voterStake: string,
  vote: 'yes'| 'no' | 'abstain'
  challenge: string 
}


async function fetchVoteMetadata (txHash:string): Promise<any> {
  const url = `${blockfrostApiUrl}${txHash}/metadata`
  console.log("Fetching:",url)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'project_id': blockfrostApiKey,
        },
    });
    const txData: any[] = await response.json();
    const label27=txData.filter(x=>x.label==='27')[0].json_metadata
    return label27;
};

export async function fetchPollSummaryMetadata(txHash: string):Promise<SummaryTxMetadata>{
  const strings: string[]= await fetchVoteMetadata(txHash)
  let txHashes=[]
    const delegateIndex = strings.indexOf("Delegate Signature Transaction Hashes:");

    // If the index is found, slice the array and filter out the hashes
    if (delegateIndex !== -1) {
      txHashes= strings.slice(delegateIndex + 1).filter(item => /^[a-f0-9]{64}$/.test(item));
    }

  // Initialize variables to store the metadata
  let pollName = "";
  let constutionHash = "";
  let yesVotes = 0;
  let noVotes = 0;
  let abstainVotes = 0;
  let eligibleVoters = 0;
  let approvalPercent = 0;

  
  strings.slice(0,delegateIndex).forEach((line, index) => {
    // Extract poll name
    if (line.startsWith("Poll: ")) {
      pollName = line.replace("Poll: ", "").trim();
    }

    // Extract constitution hash
    if (line.startsWith("Text Hash:")) {
      constutionHash = strings[index+1].trim();
    }

    // Extract Yes, No, Abstain votes
    if (line.startsWith("Yes Votes: ")) {
      yesVotes = parseInt(line.replace("Yes Votes: ", "").trim(), 10);
    }
    if (line.startsWith("No Votes: ")) {
      noVotes = parseInt(line.replace("No Votes: ", "").trim(), 10);
    }
    if (line.startsWith("Abstain Votes: ")) {
      abstainVotes = parseInt(line.replace("Abstain Votes: ", "").trim(), 10);
    }

    // Extract total eligible voters
    if (line.startsWith("Total Eligible Voters: ")) {
      eligibleVoters = parseInt(line.replace("Total Eligible Voters: ", "").trim(), 10);
    }

    // Extract approval percentage
    if (line.startsWith("Approval Result: ")) {
      const approvalResult = line.replace("Approval Result: ", "").trim();
      approvalPercent = parseFloat(approvalResult.replace("%", ""));
    }
  });

  // Return the structured metadata
  return {
    votes: {
      yes: yesVotes,
      no: noVotes,
      abstain: abstainVotes
    },
    eligibleVoters,
    approvalPercent,
    voteTransactions: txHashes,
    pollName,
    constutionHash
  };
};

export async function fetchVoteTxMetadata(txHash: string):Promise<Vote[]>{
  const voteData: OnChainVoteData[] = await fetchVoteMetadata(txHash)
  return voteData.map(v=>{
    const voterName=Object.keys(v)
    const voteData =v[voterName[0]]
    const voteStr=voteData.join('')
    const result =extractVoteData(voteStr)
    result.voterName=voterName[0]
    return result

  })
}

function extractVoteData(data:string): Vote {
  // Regular Expressions for matching different parts
  const pollNameRegex = /Poll: ([^,]+)/;
  const constitutionHashRegex = /Hashed Constitution Text: ([^,]+)/;
  const constitutionLinkRegex = /Link to Constitution Text: ([^,]+)/;
  const voteRegex = /Vote: (\w+)/;
  const walletRegex = /Wallet: ([^,]+)/;
  const cosign1Regex = /Signature: ([^,]+)/;
  const cosekeyRegex = /Public Key: ([^,]+)/;
  const challengeRegex = /Challenge: ([^,]+)/;
  // Match each one
  const pollNameMatch = data.match(pollNameRegex);
  const constitutionHashMatch = data.match(constitutionHashRegex);
  const constitutionLinkMatch = data.match(constitutionLinkRegex);
  const voteMatch = data.match(voteRegex);
  const walletMatch = data.match(walletRegex);
  const cosign1Match = data.match(cosign1Regex);
  const cosekeyMatch = data.match(cosekeyRegex);
  const challengeMatch = data.match(challengeRegex)

  const validateVote = (vote:string): 'yes'|'no'|'abstain' => {
    const validVotes = ['yes', 'no', 'abstain'];
    return validVotes.includes(vote) ? vote as any : 'abstain';
  };
  
  return {
    pollName: pollNameMatch ? pollNameMatch[1] : '',
    voterName: walletMatch ? walletMatch[1] : '',
    constutionHash: constitutionHashMatch ? constitutionHashMatch[1] : '',
    constutionLink: constitutionLinkMatch ? constitutionLinkMatch[1] : '',
    voterStake: walletMatch ? walletMatch[1] : '',
    challenge: challengeMatch? challengeMatch[1]: '',
    vote: voteMatch ? validateVote(voteMatch[1]) : 'abstain',
    cosesign1: cosign1Match ? cosign1Match[1] : '',
    cosekey: cosekeyMatch ? cosekeyMatch[1] : ''
  };
}

  // Sample content to be parsed
  // Wallet: stake_test1uqp28kgg6cafhzuf74eyh8trpa4fh5w50776wk5xh5npv8gx0zh92, 
  // Poll: Rustic Plastic Chips, Hashed Constitution Text: 16885f03dd0368dbcaaf80ea0ebc5c2e81b46dd082ec628662d69968af096f8d, 
  // Link to Constitution Text: https://proud-publication.info/, Vote: no, 
  // Timestamp: 12/2/2024, 11:14:32 PM, Challenge: fa2c6340ddfbb809735bd51217f0cbcbd3bd2b487654549f054e74ac5e8c9d87
  export function decodeOnChainPayload(data: string): VotePayload {
    // Regular Expressions for matching different parts of the data
    const pollNameRegex = /Poll: ([^,]+)/;
    const constitutionHashRegex = /Hashed Constitution Text: ([^,]+)/;
    const constitutionLinkRegex = /Link to Constitution Text: ([^,]+)/;
    const voteRegex = /Vote: (\w+)/;
    const walletRegex = /Wallet: ([^,]+)/;
    const challengeRegex = /Challenge: ([^,]+)/;
    
    // Match each part of the data
    const pollNameMatch = data.match(pollNameRegex);
    const constitutionHashMatch = data.match(constitutionHashRegex);
    const constitutionLinkMatch = data.match(constitutionLinkRegex);
    const voteMatch = data.match(voteRegex);
    const walletMatch = data.match(walletRegex);
    const challengeMatch = data.match(challengeRegex);
  
    // Validate the vote (same as the one in the extractVoteData function)
    const validateVote = (vote: string): 'yes' | 'no' | 'abstain' => {
      const validVotes = ['yes', 'no', 'abstain'];
      return validVotes.includes(vote) ? vote as any : 'abstain';
    };
  
    // Return the parsed data in a structured format
    return {
      pollName: pollNameMatch ? pollNameMatch[1] : '',
      constutionHash: constitutionHashMatch ? constitutionHashMatch[1] : '',
      constutionLink: constitutionLinkMatch ? constitutionLinkMatch[1] : '',
      voterStake: walletMatch ? walletMatch[1] : '', // In this case, it seems to be the wallet address again
      challenge: challengeMatch ? challengeMatch[1] : '',
      vote: voteMatch ? validateVote(voteMatch[1]) : 'abstain',
    };
  }