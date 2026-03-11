interface DiscoBallProps {
  size?: number
}

export default function DiscoBall({ size = 120 }: DiscoBallProps) {
  const tileRows = 8
  const tileCols = 6
  const tileW = size / tileCols
  const tileH = size / tileRows

  // Generate tile shades to simulate mirrored facets
  const shades = [
    "#ffffff", "#e0e0e0", "#c8c8c8", "#d4af37", "#b8b8b8",
    "#f0f0f0", "#a0a0a0", "#d4af37", "#ffffff", "#c0c0c0",
    "#e8e8e8", "#b0b0b0",
  ]

  return (
    <div style={{ display: "inline-block", position: "relative", textAlign: "center" }}>
      {/* Hanging string */}
      <div
        style={{
          width: 2,
          height: 28,
          background: "linear-gradient(to bottom, #555, #888)",
          margin: "0 auto",
        }}
      />

      {/* Disco ball container with spin animation */}
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          margin: "0 auto",
          animation: "discoBallSpin 12s linear infinite",
        }}
      >
        {/* SVG disco ball */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ display: "block" }}
        >
          <defs>
            {/* Clip to circle */}
            <clipPath id="ballClip">
              <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} />
            </clipPath>
            {/* Radial gradient for 3D sphere shading */}
            <radialGradient id="sphereShade" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#888888" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
            </radialGradient>
          </defs>

          {/* Base dark circle */}
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill="#1a1a1a" />

          {/* Mirror tiles */}
          <g clipPath="url(#ballClip)">
            {Array.from({ length: tileRows }).map((_, row) =>
              Array.from({ length: tileCols }).map((_, col) => {
                const shade = shades[(row * tileCols + col) % shades.length]
                const opacity = 0.5 + Math.random() * 0.5
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={col * tileW + 1}
                    y={row * tileH + 1}
                    width={tileW - 2}
                    height={tileH - 2}
                    fill={shade}
                    fillOpacity={opacity}
                    rx={1}
                  />
                )
              })
            )}
          </g>

          {/* 3D shading overlay */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 1}
            fill="url(#sphereShade)"
            clipPath="url(#ballClip)"
          />

          {/* Specular highlight */}
          <ellipse
            cx={size * 0.38}
            cy={size * 0.3}
            rx={size * 0.12}
            ry={size * 0.08}
            fill="white"
            fillOpacity={0.7}
          />
        </svg>
      </div>

      {/* Light scatter dots beneath the ball */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: size * 3, pointerEvents: "none" }}>
        {[
          { x: -90, y: 80, color: "#d4af37", delay: "0s", dur: "3s" },
          { x: 80, y: 100, color: "#cc2478", delay: "0.5s", dur: "2.7s" },
          { x: -40, y: 130, color: "#00c6a2", delay: "1s", dur: "3.3s" },
          { x: 110, y: 60, color: "#d4af37", delay: "1.5s", dur: "2.5s" },
          { x: -120, y: 40, color: "#cc2478", delay: "0.8s", dur: "3.1s" },
          { x: 50, y: 150, color: "#00c6a2", delay: "0.3s", dur: "2.9s" },
          { x: -60, y: 170, color: "#d4af37", delay: "1.2s", dur: "3.5s" },
          { x: 130, y: 120, color: "#cc2478", delay: "0.7s", dur: "2.8s" },
        ].map((dot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${dot.x}px)`,
              top: dot.y,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: dot.color,
              boxShadow: `0 0 8px 3px ${dot.color}`,
              animation: `discoScatter ${dot.dur} ease-in-out ${dot.delay} infinite alternate`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes discoBallSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes discoScatter {
          0%   { opacity: 0.1; transform: scale(0.6); }
          50%  { opacity: 0.9; transform: scale(1.2); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
