import ReservationClient from './ReservationClient'

export default async function Page({
  params,
}: {
  params: Promise<{ ticket_id: string }>
}) {
  const { ticket_id } = await params
  return <ReservationClient ticketId={ticket_id} />
}
