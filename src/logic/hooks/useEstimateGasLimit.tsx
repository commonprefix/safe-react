import { useEffect, useState } from 'react'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import useAsync from 'src/logic/hooks/useAsync'
import { GAS_LIMIT_MULTIPLIER } from 'src/utils/constants'

export const DEFAULT_GAS_LIMIT = '0'

export const useEstimateGasLimit = (
  estimationFn: () => Promise<number>,
  isExecution: boolean,
  txData: string,
  manualGasLimit: string | undefined,
): string | undefined => {
  const [gasLimit, setGasLimit] = useState<string | undefined>(manualGasLimit)

  const [data, error] = useAsync(async () => {
    if (!isExecution || !txData) return
    if (manualGasLimit) return String(Number(manualGasLimit) * GAS_LIMIT_MULTIPLIER)

    return await estimationFn()
  }, [estimationFn, isExecution, manualGasLimit, txData])

  useEffect(() => {
    const newGasLimit = error ? DEFAULT_GAS_LIMIT : data ? data.toString() : undefined

    if (newGasLimit) {
      setGasLimit(String(Number(newGasLimit) * GAS_LIMIT_MULTIPLIER))
    }

    if (error) {
      logError(Errors._612, error.message)
    }
  }, [data, error])

  return gasLimit
}
