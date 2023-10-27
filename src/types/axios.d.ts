import "axios"

declare module "axios" {
  export interface AxiosRequestConfig {
    embeddedParams?: Report<string, string>
  }
}
