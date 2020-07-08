import { createServices, Service } from "./services";

export type Context = Service;

export function createContext(): Context {
  return createServices();
}
