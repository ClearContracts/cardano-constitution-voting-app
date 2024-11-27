import Button from '@mui/material/Button';

interface Props {
  txId: string;
}

/**
 * A button for viewing a TX on the blockchain
 * @returns View TX Button
 */
export function ViewTxButton(props: Props): JSX.Element {
  const { txId } = props;

  return (
    <a
      href={
        process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
          ? `https://cardanoscan.io/transaction/${txId}?tab=metadata`
          : `https://preview.cardanoscan.io/transaction/${txId}?tab=metadata`
      }
      target="_blank"
    >
      <Button variant="contained" data-testid="view-tx-button">
        View Result On-Chain
      </Button>
    </a>
  );
}
