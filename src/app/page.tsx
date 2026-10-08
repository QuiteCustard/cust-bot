import Image from 'next/image'
import { commands } from '@/helpers/commands/commands'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-4 py-16 sm:py-24">
      <Image
        src="/custbot.png"
        alt="CustBot"
        width={256}
        height={256}
        priority
        className="h-52 w-52 sm:h-64 sm:w-64"
      />
      <p className="max-w-md text-center text-lg leading-relaxed text-navy/70">
        A little Discord helper for translating messages, posting timestamps that show in
        everyone&apos;s local time, and keeping score of who has paid Custard.
      </p>

      <section className="mt-20 w-full">
        <h2 className="text-2xl font-extrabold">Commands</h2>
        <ul className="mt-5 divide-y divide-mist rounded-2xl border border-mist">
          {commands.map((command) => (
            <li
              key={command.name}
              className="flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <code className="shrink-0 font-mono font-semibold text-sky sm:w-28">
                /{command.name}
              </code>
              <div className="flex flex-col gap-2">
                <p className="leading-snug">{command.description}</p>
                {command.options && command.options.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {command.options.map((option) => (
                      <li
                        key={option.name}
                        className="rounded-md bg-sky-light px-2 py-0.5 font-mono text-xs text-navy/80"
                      >
                        {option.name}
                        {!option.required && '?'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-navy/50">
          Options marked <code className="font-mono">?</code> are optional.
        </p>
      </section>

      <footer className="mt-auto pt-20 text-sm text-navy/50">
        Built with Next.js, DeepL and Upstash Redis.
      </footer>
    </main>
  )
}
