import http from '@utils/http'

import type { ServiceReturn } from '@/types/Delta'

import type { ChannelUnread } from '@/types/Sync'

const DeltaSync = () => {
  const getUnreads = async():
    ServiceReturn<ChannelUnread[]> =>
  {
    const [ err, data ] = await http.get('sync/unreads')
    return [ err, data ]
  }

  return {
    getUnreads
  }
}

export default DeltaSync
