import environments from "lib/constants/environments";
import fetch, { BodyInit, RequestInit } from "node-fetch";


type KuberBalanceResponse = {
  txin: string;
  value: KuberValue;
  address?: string;
};

const config = {
  apiUrl: environments.kuber.apiUrl,
  apiKey: environments.kuber.apiKey,
};


export type KuberValue = {
  [policyId: string]: Record<string, BigInt | number> | BigInt | number;
};




export type ProtocolParams = {
  dRepDeposit: number;
  govActionDeposit: number;
  protocolVersion: ProtocolVersionType;
};

export type ProposedGovAction = {
  id: number;
  attributes: {
    gov_action_type_name: string;
    createdAt: string;
    updatedAt: string;
  };
};


export type ProtocolVersionType = {
  major: number;
  minor: number;
};


class Kuber {
  walletAddr: string;
  signingKey: string;
  version: string;

  constructor(walletAddr: string, signingKey: string, version = "v1") {
    this.walletAddr = walletAddr;
    this.signingKey = signingKey;
    this.version = version;
  }

  signTx(tx: any) {
    return {
      ...tx,
      selections: [
        ...(tx.selections || []),
        {
          type: "PaymentSigningKeyShelley_ed25519",
          description: "Payment Signing Key",
          cborHex: "5820" + this.signingKey,
        },
        this.walletAddr,
      ],
      changeAddress: this.walletAddr,
    };
  }
}

const kuberService = {
  submitTransaction(tx: any) {
    return fetch(config.apiUrl + "/api/v1/tx/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },

      body: JSON.stringify({
        tx: {
          description: "",
          type: "Tx ConwayEra",
          cborHex: tx,
        },
      }),
      redirect: "follow",
    });
  },


  getBalance: async (addr: string) => {
    const utxos: any[] = await callKuber(`/api/v3/utxo?address=${addr}`);
    const balanceInLovelace = utxos.reduce(
      (acc, utxo) => acc + utxo.value.lovelace,
      0
    );
    return balanceInLovelace / 1000000;
  },




  getTransactionDetails(txHash: string) {
    return fetch(config.apiUrl + "/api/v3/utxo?txin=" + txHash + "%230", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },
    });
  },

  queryUtxos(address: string): Promise<[KuberBalanceResponse]> {
    return callKuber("/api/v3/utxo?address=" + address) as Promise<
      [KuberBalanceResponse]
    >;
  },

  queryProtocolParams() {
    return callKuber("/api/v3/protocol-params") as Promise<ProtocolParams>;
  },

};
async function callKuber(
  path: any,
  method: "GET" | "POST" = "GET",
  body?: BodyInit,
  contentType = "application/json"
) {
  const url = config.apiUrl + path;

  const headers: Record<string, string> = {
    "api-key": config.apiKey,
  };
  if (contentType) {
    headers["content-type"] = contentType;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (method === "POST") {
    if (body) options.body = body;
  }

  return fetch(url, options).then(async (res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return res.text().then((txt) => {
        let err;
        let json: any;
        try {
          json = JSON.parse(txt);
          if (json) {
            err = Error(
              `KuberApi [Status ${res.status}] : ${
                json.message ? json.message : txt
              }`
            );
          } else {
            err = Error(`KuberApi [Status ${res.status}] : ${txt}`);
          }
        } catch (e) {
          err = Error(`KuberApi [Status ${res.status}] : ${txt}`);
        }
        err.status = res.status;
        throw err;
      });
    }
  });
}

export default kuberService;