import { IError } from "./IError";

export interface IResponse {
  isSuccess: boolean,
  isFailure: boolean,
  error: IError,
  value: any
}