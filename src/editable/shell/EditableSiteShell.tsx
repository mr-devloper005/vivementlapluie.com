import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`editable-shell-frame ${dc.shell.page} relative flex min-h-screen flex-col ${className}`}>
      <EditableNavbar />
      <div className="relative z-10 min-h-0 flex-1">{children}</div>
      <EditableFooter />
    </div>
  )
}
