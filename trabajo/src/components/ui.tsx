import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

const press =
  'cursor-pointer transition-transform duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100'

export const controlClass =
  'w-full rounded-[2px] border border-line bg-panel px-2.5 py-2 text-sm text-ink transition-colors duration-150'

export const areaClass = `${controlClass} min-h-24 resize-y leading-relaxed`

export const linkClass =
  'inline-flex items-center gap-1.5 text-sm text-ink underline decoration-[#44403c] underline-offset-4 hover:decoration-ink'

export const surfaceClass = 'border border-line px-4 py-4 lg:px-6'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>
}

export function PrimaryButton({ className = '', type = 'button', ref, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] bg-ink px-3 py-2 text-sm text-paper ${press} ${className}`}
      {...props}
    />
  )
}

export function QuietButton({ className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] border border-line bg-transparent px-3 py-2 text-sm text-ink ${press} ${className}`}
      {...props}
    />
  )
}

export function TextButton({ className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-1.5 text-sm text-ink underline decoration-[#44403c] underline-offset-4 hover:decoration-ink ${press} ${className}`}
      {...props}
    />
  )
}

export function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`flex min-w-0 flex-col gap-2 text-sm ${className}`}>
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  )
}

