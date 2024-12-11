import environments from "@constants/environments";
import { expect, Page } from "@playwright/test";
import Logger from "./logger";
import kuberService from "./kuberService";

export async function pollTransaction(
  txHash: string,
) {
  try {
    Logger.info(`Waiting for tx completion: ${txHash}`);
    await expect
      .poll(
        async () => {
          const response = await kuberService.getTransactionDetails(txHash);
          const data = await response.json();
          return data.length;
        },
        {
          timeout: environments.txTimeOut,
        }
      )
      .toBeGreaterThan(0);

    Logger.success("Tx completed: "+txHash);

  } catch (err) {
    throw err;
  }
}

export async function waitForTxConfirmation(
  page: Page,
) {
  let txId: string | undefined;
  try {
    const transactionStatusPromise = page.waitForRequest((request) => {
      return request.url().includes("/transaction/submit");
    });

    const response = await (await transactionStatusPromise).response();
    const resonseJson: any=JSON.parse((await response.body()).toString());
    txId = resonseJson['submitTxId'];
    

    if (txId) {
      await pollTransaction(txId);
    }
  } catch (error) {
    Logger.fail(error.message);
    throw new Error(error);
  }
}

export async function waitForTxSubmit(
  page: Page,
) {
  let txId: string | undefined;
  try {
    const transactionStatusPromise = page.waitForRequest((request) => {
      return request.url().includes("/transaction/submit");
    });

    const response = await (await transactionStatusPromise).response();
    const resonseJson: any=JSON.parse((await response.body()).toString());
    txId = resonseJson['submitTxId'];
    

    if (!txId) {
      throw new Error("response doesn't have txid")
    }
    Logger.success("Transaction submitted:"+txId)
    return txId
  } catch (error) {
    Logger.fail(error.message);
    throw new Error(error);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function nAtaTime<T,U>(array: T[], f: (item: T,index?:number) => Promise<U>,n:number =10): Promise<U[]> {
  const chunkSize = n;
  let results: U[] = [];

  // Process the array in chunks of `n`
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);

    // Wait for all async operations on this chunk to finish and collect the results
    const chunkResults = await Promise.all(chunk.map((item,index) => f(item,index)));
    
    // Push the results of the current chunk to the results array
    results.push(...chunkResults);
  }

  return results;
}
