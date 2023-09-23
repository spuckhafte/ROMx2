
/**Record data */
export type BlockType = {
    heading: string,
    details: string,
    fileName: string,
    parent: string,
    version: number,
}

export type ChainErrors =
    "[error: chain impure (breach suspected)]" |
    "[rejected: invalid previous block]" |
    "[rejected: invalid hash]"

export type BlockAsJSON = {
    id: string,
    timestamp: number,
    prevBlockHash: string,
    nonce: number,
    data: BlockType,
}