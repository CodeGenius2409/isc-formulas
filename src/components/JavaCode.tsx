import { memo } from 'react';
import { tokenizeJava, type Token } from '../java/tokens';

export function JavaTokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((token, i) =>
        token.kind === 'plain' ? (
          token.text
        ) : (
          <span key={i} className={`tok-${token.kind}`}>
            {token.text}
          </span>
        ),
      )}
    </>
  );
}

/** A piece of Java, coloured as it is in the tracer's editor. */
export const JavaCode = memo(function JavaCode({ code }: { code: string }) {
  return (
    <code className="java-code">
      <JavaTokens tokens={tokenizeJava(code)} />
    </code>
  );
});
