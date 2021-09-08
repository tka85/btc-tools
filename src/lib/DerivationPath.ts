export class DerivationPath {
    // All limits are inclusive
    static get NON_HARDENED_ADDR_PATH_LOWER_LIMIT(): number {
        return 0;
    }
    static get NON_HARDENED_ADDR_PATH_UPPER_LIMIT(): number {
        return 0x7FFFFFFF; // 2^31-1
    }
    static get HARDENED_ADDR_PATH_LOWER_LIMIT(): number {
        return 0x80000000; // 2^31
    }
    static get HARDENED_ADDR_PATH_UPPER_LIMIT(): number {
        return 0xFFFFFFFF; // 2^32-1
    }

    private originalPath: string[]; // string array; contains hardened components
    private normalizedPath: number[] = []; // number array; all hardened components have been converted to corresponding integers

    /**
     * Reduces user provided path to a form usable for derivation by bitcoinjs-lib
     * "" => ""
     * "m" => ""
     * "m/" => ""
     * "m/0" => "0"
     * "/0" => "0"
     * "0" => "0"
     * "/1/2/3" => "1/2/3"
     * "1/2/3" => "1/2/3"
     * "1/2/3/" => "1/2/3"
     * "/1/2/3/" => "1/2/3"
     *
     * @param path      Hardened components can be denoted with a prime symbol "'" or with a "h" e.g. 0/44h/0h/0 is same as 0/44'/0'/0
     */
    constructor(path: string, hardenedChildren = false) {
        // drop leading 'm/', or '/' and trailing '/'
        path = path.replace(/[/]$/, '').replace(/^m?[/]?/, '');
        // Add to provided path the last part that will be getting incremented
        if (!path) {
            path = `0${hardenedChildren ? "'" : ''}`;
        } else {
            path += `/0${hardenedChildren ? "'" : ''}`;
        }
        // Get array of all path components; contains hardened parts
        this.originalPath = path.split('/');
        this.normalizedPath = DerivationPath.normalize(this.originalPath);
    }

    originalPathToString(): string {
        return this.originalPath.join('/');
    }

    normalizedPathToString(): string {
        return this.normalizedPath.join('/');
    }

    /**
     * Convert string[] of non-normalized path components (i.e. can contain hardened components)
     * into numbers[] of normalized path components (i.e. all hardened components are converted into respective numbers)
     */
    static normalize(inputPath: string[]): number[] {
        const normalizedPath: number[] = [];
        inputPath.forEach(_ => {
            const hardMatch = /(\d+)['h]/.exec(_);
            if (!hardMatch) {
                normalizedPath.push(parseInt(_, 10));
            } else {
                normalizedPath.push(parseInt(hardMatch[0], 10) + DerivationPath.HARDENED_ADDR_PATH_LOWER_LIMIT);
            }
        });
        return normalizedPath;
    }

    /**
     * Convert normalized path (numbers[]) into a human readable string (contains hard components)
     * e.g. for normalizedPath [0, 2147483648, 2147483649, 0] it returns "0/0'/1'/0"
     */
    toString(): string {
        return this.normalizedPath.map(_ => {
            if (_ >= DerivationPath.HARDENED_ADDR_PATH_LOWER_LIMIT) {
                // hardened
                return `${_ - DerivationPath.HARDENED_ADDR_PATH_LOWER_LIMIT}'`;
            }
            return `${_}`;
        }).join('/');
    }

    /**
     * Reset the normalizePath (number[]) using as reference the originalPath (string[])
     */
    resetPath(): void {
        this.normalizedPath = DerivationPath.normalize(this.originalPath);
    }

    /**
     * Alter normalizedPath to go one level up i.e. drop last path component
     */
    goOneLevelUp(): void {
        this.normalizedPath.pop();
    }

    /**
     * Alter normalizedPath (number[]) to go one level deeper i.e. adds a new path component
     */
    addOneLevelDown(component: string): void {
        let componentNumber = parseInt(component, 10)
        if (/[h']/.exec(component)) {
            componentNumber += DerivationPath.HARDENED_ADDR_PATH_LOWER_LIMIT;
        }
        this.normalizedPath.push(componentNumber);
    }

    /**
     * Increments by n the last path component of the normalizedPath e.g. for default n=1 path 0/0/1 becomes 0/0/2
     */
    incrementPath(n = 1): void {
        this.normalizedPath[this.normalizedPath.length - 1] += n;
    }
}