export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Vercel Build Test: v1</h1>
      <p>If you see this, Vercel is successfully deploying new files.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  )
}
