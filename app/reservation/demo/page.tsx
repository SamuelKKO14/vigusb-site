import ReservationClient from '../[ticket_id]/ReservationClient'

// Alias page: /reservation/demo → shows ticket VB42 as demo
export default function ReservationDemoPage() {
  return <ReservationClient ticketId="VB42" />
}
