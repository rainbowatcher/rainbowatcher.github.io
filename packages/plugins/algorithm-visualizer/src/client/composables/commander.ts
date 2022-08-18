interface Command {
  // key: string
  type: string
  args: Array<number>
  reverse?: string
}

abstract class Commander {
  protected commands: Array<Command> = []

  command(type: string, args: number[], reverse?: string) {
    this.commands.push({ type, args, reverse: reverse ?? type })
  }

  getCommands() {
    return this.commands
  }

  abstract toJson(): unknown
}

export { Commander }
export type { Command }
