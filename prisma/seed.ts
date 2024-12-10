import { prisma } from '../src/db';
import {Ed25519Key, HdKey,HdWallet,ShelleyAddress,bech32} from "libcardano";

const NETWORK:number=1

function createRange(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

function showIndex(index: number){
  return (index+1).toString().padStart(2,'0');
}

const seedDB = async (): Promise<void> => {

  // create workshops first
  const rawWorkshops = createRange(0,64).map((index)=>{return { name: 'Workshop '+showIndex(index) }})
  
  await prisma.workshop.createMany({ data: rawWorkshops });
  let workshops = (await prisma.workshop.findMany())

  const  wallet= await HdWallet.fromMnemonicString('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art')
  const getAccount = async (index:number)=>{
    const nthWallet=await wallet.getAccount(index)
    const singleAddrWallet = await nthWallet.singleAddressWallet()
    return singleAddrWallet.rewardAddressBech32(NETWORK)!
  }
  
  const toBech32=(hex:string)=>{
    return bech32.encode((NETWORK===0?'stake_test': 'stake'),Buffer.from((NETWORK===0?'e0':'e1')+hex,'hex'));
  }

  // make first 3 wallets for manual testing
  const organizerWallet= toBech32('c6924088c74fb299e0204c3e2ff492a65c2a8ade59506dcd589c01e9')
  const delegateWAllet=toBech32('44c8b3648fbaf15bd58b249ee4c33327367924b8da8a4f1fee9b69da')
  const alternateWallet=toBech32('755d09a0e7deee35ef841ec808292a14ae030f1d6d55b3c85b0f9682')

  // other walelts for automated testing
  // 10 organizers
  const automatedOrganizers=await Promise.all(createRange(3,13).map(getAccount))
  // 63 delegates
  const automatedDelegates=await Promise.all(createRange(13,13+63).map(getAccount))
  // 63 alternates
  const automatedAlternates=await Promise.all(createRange(13+63,13+63+63).map(getAccount))
  

  const organizers=[organizerWallet,...automatedOrganizers].map((wallet,index)=>{
    return {
      is_convention_organizer: true,
      is_delegate: false,
      is_alternate: false,
      workshop_id: workshops[63].id, // all organizers are in the last workshop
      name: 'Test organizer '+showIndex(index),
      email: `testOrganizer${showIndex(index)}@email.com`,
      wallet_address:wallet,
    }
  });
  const delegates=[delegateWAllet,...automatedDelegates].map( (wallet,index)=>{
    return {
      is_convention_organizer: false,
      is_delegate: true,
      is_alternate: false,
      workshop_id: workshops[index].id,
      name: 'Test Delegate '+(showIndex(index)),
      email: `delegate${showIndex(index)}@email.com`,
      wallet_address:wallet,
    }
  })
  const alternates=[alternateWallet,...automatedAlternates].map( (wallet,index)=>{
    return {
      is_convention_organizer: false,
      is_delegate: false,
      is_alternate: true,
      workshop_id: workshops[index].id,
      name: 'Test Alternate '+showIndex(index),
      email: `alternate${showIndex(index)}@email.com`,
      wallet_address:wallet,
    }
  })

  await prisma.user.createMany({ data: [...organizers,...delegates,...alternates] });

  const createdDelegates=await prisma.user.findMany({where: {
    is_delegate:true
  }})
  const createdAlternates=await prisma.user.findMany({where: {
    is_alternate:true
  }})

  workshops.pop() // remove the workshop used for organizers.

  await Promise.all(
    workshops.map(async (workshop,index)=>{
      await prisma.workshop.update({
        where: { id: workshop.id },
        data: {
          delegate_id: createdDelegates[index].id,
          alternate_id: createdAlternates[index].id,
          active_voter_id:createdDelegates[index].id,
        },
    });
  }))
};

seedDB()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
