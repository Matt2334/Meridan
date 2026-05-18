import { Suspense } from 'react'
import Session from '../../components/Session'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Session />
    </Suspense>
  )
}