import { ImageResponse } from 'next/og';

export const alt =
  'Engineering Notes by Dileep T — practical writing about the modern web';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #071126 0%, #0f1e3d 58%, #123b66 100%)',
          color: '#f8fafc',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '2px solid rgba(125, 211, 252, 0.42)',
            borderRadius: '36px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            padding: '64px',
            width: '100%',
          }}
        >
          <div
            style={{
              color: '#7dd3fc',
              display: 'flex',
              fontSize: 26,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Dileep T
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 76,
                fontWeight: 700,
                letterSpacing: '-0.035em',
              }}
            >
              Engineering Notes
            </div>
            <div
              style={{
                color: '#cbd5e1',
                display: 'flex',
                fontSize: 34,
              }}
            >
              Accessible interfaces. Durable systems. Practical AI.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
