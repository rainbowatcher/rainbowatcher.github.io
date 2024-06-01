type Command = {
    args: number[]
    reverse?: string

    // key: string
    type: string
}

abstract class Commander {

    protected commands: Command[] = []

    command(type: string, args: number[], reverse?: string) {
        this.commands.push({ args, reverse: reverse ?? type, type })
    }

    getCommands() {
        return this.commands
    }

    abstract toJson(): unknown

}

export { Commander }
export type { Command }
