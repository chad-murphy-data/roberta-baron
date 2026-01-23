interface NewsTickerProps {
  headline: string
}

export default function NewsTicker({ headline }: NewsTickerProps) {
  if (!headline) return null

  return (
    <div className="news-ticker">
      <div className="news-ticker-content">
        <span className="breaking">BREAKING:</span>
        <span>{headline}</span>
        <span className="breaking">BREAKING:</span>
        <span>{headline}</span>
      </div>
    </div>
  )
}
