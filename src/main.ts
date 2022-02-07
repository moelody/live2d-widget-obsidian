import { Plugin, Notice } from "obsidian"
import getServer from './proxy/server'
import getPort from "get-port"
import { LoadFontawesome, LoadLive2D, UnloadLive2D, UnloadFontawesome, Live2DSettings, Live2DSettingsTab, DEFAULT_SETTINGS } from './settings'
export default class Live2DPlugin extends Plugin {
    settings: Live2DSettings = DEFAULT_SETTINGS

    server?: ReturnType<typeof getServer>

    setupProxy = (port: number): void => {
        if (this.server) this.server.close().listen(port)
        else {
            this.server = getServer(port, this)
            this.server.on("error", (err: { message: string | string[] }) => {
                console.error(err)
            })
        }
    }

    /**
     * detect if port being used, and save free port
     * @param port desire port
     * @returns free port
     */
    setupPort = async (port: number): Promise<number> => {
        const newPort = await getPort({ port })
        if (this.settings.port !== newPort) {
            this.settings.port = newPort
            await this.saveSettings()
        }
        return newPort
    }

    async onload() {

        console.log("loading Live2dOB")

        await this.loadSettings()
        this.addSettingTab(new Live2DSettingsTab(this.app, this))

        const newPort = await this.setupPort(this.settings.port)
        this.setupProxy(newPort)
        LoadFontawesome(this.settings)
        LoadLive2D(this.settings)
    }

    onunload() {
        console.log("unloading Live2dOB")

        this.server?.close()
        UnloadLive2D()
        UnloadFontawesome()
    }

    async loadSettings() {
        this.settings = { ...this.settings, ...(await this.loadData()) }
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

}