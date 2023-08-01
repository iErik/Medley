export = RevoltAPI
export as namespace RevoltAPI

// -> Imports
// ----------

import * as Common from './Common'
import * as Chat from './Chat'
import * as User from './User'
import * as Emoji from './Emoji'

import * as Bonfire from './Bonfire'
import * as Events from './Bonfire/Events'

// -> Aliases
// ----------


// -> Namespace
// ------------

declare namespace RevoltAPI {
  export {
    Common,
    Chat,
    User,
    Emoji,
    Bonfire,
    Events
  }

  // -> Exports
  // ----------
}
