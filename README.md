# SentinelSIFT-X Dashboard

SentinelSIFT-X Dashboard is the frontend interface for SentinelSIFT-X, an autonomous Digital Forensics and Incident Response (DFIR) investigation platform.

The dashboard enables investigators to upload evidence, launch investigations, monitor agent execution, review findings, analyze performance metrics, and generate investigation reports through a modern web interface.

## Features

* Upload forensic investigation datasets
* Launch autonomous investigations
* Real-time investigation workflow visualization
* Multi-agent execution monitoring
* Findings exploration and evidence review
* Investigation report generation
* Benchmarking and performance analytics
* Export reports in multiple formats

## Technology Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts
* Vercel Deployment

## Project Structure

```text
app/
components/
lib/
public/
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url
```

## Installation

```bash
git clone https://github.com/your-username/sentinelsift-x-dashboard.git

cd sentinelsift-x-dashboard

npm install

npm run dev
```

Frontend will start on:

```text
http://localhost:3000
```

## Deployment

Production deployment:

```text
https://sentinelsift-x-dashboard.vercel.app
```

## Related Repository

Backend Repository:

```text
https://github.com/your-username/sentinelsift-x
```

## License

MIT License
