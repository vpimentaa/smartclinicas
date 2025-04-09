# SmartClínicas

A medical clinic management system built with Next.js and Supabase.

## Features

- User authentication and authorization
- Patient management
- Professional management
- Clinic management
- Appointment scheduling
- Medical records
- Financial transactions
- Document management

## Tech Stack

- Next.js 14
- TypeScript
- Supabase
- Tailwind CSS
- Vercel (Deployment)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smartclinicas.git
cd smartclinicas
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

### Deployment

#### Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Run the SQL migrations from `supabase/migrations/20240409000000_initial_schema.sql` in the SQL Editor
4. Get your project URL and anon key from Project Settings -> API

#### Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

## Database Schema

The database consists of the following main tables:

- `accounts`: Organization accounts
- `users`: User profiles
- `accounts_users`: User-account relationships
- `patients`: Patient information
- `professionals`: Healthcare professionals
- `clinics`: Clinic information
- `clinic_units`: Clinic branch locations
- `appointments`: Scheduling system
- `medical_records`: Patient medical history
- `financial_transactions`: Payment and billing
- `documents`: Patient documents
- `employees`: Staff management

## Security

All tables have Row Level Security (RLS) enabled with appropriate policies to ensure data access control. The main access control is based on the `has_account_access` function, which checks if a user has access to a specific account.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- React Query
- Radix UI

## Funcionalidades

- Gestão de pacientes
- Gestão de profissionais
- Gestão de clínicas
- Agendamento de consultas
- Autenticação de usuários

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
4. Execute o projeto:
   ```bash
   npm run dev
   ```

## Deploy

O projeto está configurado para deploy automático na Vercel. Qualquer push para a branch `main` irá disparar um novo deploy.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup

The project uses Supabase as the database backend. For local development, you need to run Supabase using Docker.

### Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed

### Local Development Setup

1. Start the Supabase services:
```bash
docker-compose up -d
```

2. Access the Supabase Studio:
- Open http://localhost:3000 in your browser
- Use the following credentials:
  - Email: postgres
  - Password: postgres

3. Configure your environment variables:
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_SUPABASE_URL=https://fevakyzmqnjxxdnoxcee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldmFreXptcW5qeHhkbm94Y2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NDA4NzIsImV4cCI6MjA1NDExNjg3Mn0.J49eK4SjW69NPv_ULMc_-g2jzi1uW9nXTUlIawRS3j8
```

### Database Structure

The database consists of the following main tables:

- `accounts`: Organization accounts
- `users`: User profiles
- `accounts_users`: User-account relationships
- `patients`: Patient information
- `professionals`: Healthcare professionals
- `clinics`: Clinic information
- `clinic_units`: Clinic branch locations
- `appointments`: Scheduling system
- `medical_records`: Patient medical history
- `financial_transactions`: Payment and billing
- `documents`: Patient documents
- `employees`: Staff management

### Row Level Security

All tables have Row Level Security (RLS) enabled with appropriate policies to ensure data access control. The main access control is based on the `has_account_access` function, which checks if a user has access to a specific account.

### Migrations

Database migrations are stored in the `supabase/migrations` directory. To apply new migrations:

1. Create a new migration file with a timestamp prefix
2. Add your SQL changes
3. Restart the Supabase container:
```bash
docker-compose restart supabase
```
