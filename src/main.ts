import { Plugin } from "obsidian"
import { loadLive2D, Live2DSettings, Live2DSettingsTab, DEFAULT_SETTINGS } from './settings';


export default class Live2DPlugin extends Plugin {
    settings: Live2DSettings = DEFAULT_SETTINGS

    async onload() {

        console.log("loading Live2dOB")

        await this.loadSettings()
        loadLive2D(this.settings)
        this.addSettingTab(new Live2DSettingsTab(this.app, this));

    }

    onunload() {
        console.log("unloading Live2dOB")
    
        document.querySelector('#live2d-widget')?.remove()
        document.querySelector('head > script')?.remove()
        document.querySelector('#live2d-dialog-style')?.remove()
        document.querySelector('#live2d-tool-style')?.remove()
        document.querySelector('#live2d-widget-style')?.remove()
        document.querySelector('#live2d-script')?.remove()
        document.querySelector('#live2d-fontawesome')?.remove()
    }

    async loadSettings() {
        this.settings = { ...this.settings, ...(await this.loadData()) }
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

}