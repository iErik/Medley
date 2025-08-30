import { Route, Switch } from 'wouter'
import type { RouteProps } from 'wouter'



export type RouteComponentSlots<
  Slots extends string = string
> = {
  [SlotName in Slots]: RouteProps["component"]
}

export type RouteDefinition<
  ComponentSlots extends string
> = {
  path?: string | undefined
  components: RouteComponentSlots<ComponentSlots>
}

export type RouteMap<
  ComponentSlots extends string
> = {
  [routeName: string]: RouteDefinition<ComponentSlots>
}

export type RouteList<
  ComponentSlots extends string
> = RouteDefinition<ComponentSlots>[]



export const routeSlotsFor = <
  Slots extends string,
  T extends RouteMap<Slots>
>(
  routes: T,
  slotName: Slots
) => (
  <Switch>
    { Object.values(routes).map((route, idx) =>
      <Route
        nest
        key={`${route.path}-${idx}`}
        path={route.path}
        component={route.components[slotName]}
      />)
    }
  </Switch>
)

