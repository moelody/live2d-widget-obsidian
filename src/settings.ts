import { App, PluginSettingTab, Setting, debounce } from "obsidian"
import Live2DPlugin from "./main"

// Remember to rename these classes and interfaces!

export interface Live2DSettings
{
    [index: string]: object,
    model: {
        [index: string]: string | number,
        jsonPath: string,
        homePath: string,
        listPath: string,
        tipPath: string,
        scale: number,
    },
    display: {
        [index: string]: string | number | boolean,
        superSample: number,
        width: number,
        height: number,
        position: string,
        hOffset: number,
        vOffset: number,
        draggable: boolean
    },
    dialog: {
        [index: string]: string | number | boolean | null | object,
        enable: boolean,
        bottom: string,
        hOffset: number,
        border: string,
        background: string
    },
    tool: {
        [index: string]: string | number | boolean | null | object,
        enable: boolean,
        position: string,
        top: string,
        hOffset: number,
        color: string,
        colorHover: string,
        plane: boolean,
        camera: boolean,
        model: boolean,
        texture: boolean
    }
}


export const DEFAULT_SETTINGS: Live2DSettings =
{
    model: {
        jsonPath: 'https://unpkg.com/live2d-widget-model-hijiki@latest/assets/hijiki.model.json',
        homePath: '',
        listPath: 'https://cdn.jsdelivr.net/gh/moelody/live2d-models@latest/model_list_fairy.json',
        tipPath: 'https://cdn.jsdelivr.net/gh/moelody/live2d-models@latest/model_tips_butterfly.json',
        scale: 1,
    },
    display: {
        superSample: 2,
        width: 180,
        height: 180,
        position: "right",
        hOffset: 100,
        vOffset: 20,
        draggable: true
    },
    dialog: {
        enable: true,
        bottom: "90%",
        hOffset: 20,
        border: "1px solid rgba(224, 186, 140, .62)",
        background: "rgba(236, 217, 188, .5)"
    },
    tool: {
        enable: true,
        position: "left",
        top: "10%",
        hOffset: 20,
        color: "#7b8c9d",
        colorHover: "#0684bd",
        plane: true,
        camera: true,
        model: true,
        texture: true
    }
}

export class Live2DSettingsTab extends PluginSettingTab
{
    plugin: Live2DPlugin

    constructor(app: App, plugin: Live2DPlugin)
    {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void
    {
        let self = this
        let { containerEl } = this

        containerEl.empty()

        function setSettings(payload: string, tips: any) {
            let i = 0
            let settings = self.plugin.settings[payload]
            for (let name in settings) {

                let oldValue = settings[name]

                let setting = new Setting(containerEl)
                    .setName(name)
                    .setDesc(tips[i])

                if (typeof oldValue == 'boolean') {
                    setting.addToggle(toggle => {
                        toggle.setValue(oldValue).onChange((newVal) => {
                            settings[name] = newVal
                            self.plugin.saveSettings()
                            loadLive2D(self.plugin.settings)
                        })
                    })
                } else {
                    setting.addText(text => {
                        text.setValue(oldValue.toString()).onChange((newVal)  => {
                            settings[name] = <typeof oldValue>newVal
                            self.plugin.saveSettings()
                            loadLive2D(self.plugin.settings)
                        })
                    })
                }
                i++
            }
        }

        containerEl.createEl("h2", { text: "Model Settings" })
        let modelTip = [
            '单个模型的Json地址',
            '如果以下已配置或只使用单个模型，则可留空；否则需要配置。例如：https://cdn.jsdelivr.net/gh/moelody/live2d-models@latest/',
            '看板娘列表，配置后覆盖单个模型，不配置此项请务必配置单个模型',
            '看板娘触发，如homePath已配置可留空默认读取路径下model_tips.json',
            '模型与canvas的缩放'
        ]
        setSettings('model', modelTip)

        containerEl.createEl("h2", { text: "Display Settings" })
        let displayTip = [
            '模型超采样等级',
            'canvas的长度',
            'canvas的高度',
            '模型位置',
            '水平偏移',
            '垂直偏移',
            '是否启用拖拽'
        ]
        setSettings('display', displayTip)

        containerEl.createEl("h2", { text: "Dialog Settings" })
        let dialogTip = [
            '是否启用',
            '对话框距离模型底部比例',
            '对话框水平偏移量，根据工具栏position方向',
            '对话框边框',
            '对话框背景'
        ]
        setSettings('dialog', dialogTip)

        containerEl.createEl("h2", { text: "Tool Settings" })
        let toolTip = [
            '是否启用',
            '工具栏位置，影响对话框hOffset',
            '工具栏距离对话框顶部比例',
            '工具栏相对模型的水平偏移量',
            '工具栏图标颜色',
            '鼠标悬浮工具栏图标颜色',
            '小飞机游戏',
            '模型照相',
            '模型切换（存在模型列表时有效）',
            '模型皮肤切换（模型配置有多贴图时有效）'
        ]
        setSettings('tool', toolTip)

        const coffeeDiv = containerEl.createDiv("coffee")
        coffeeDiv.addClass("oz-coffee-div")
        const coffeeLink = coffeeDiv.createEl("a", { href: "https://afdian.net/@moelody" })
        const coffeeImg = coffeeLink.createEl("img", {
            attr: {
                src: "https://cdn.jsdelivr.net/gh/moelody/cdn/blog/wechatpay.png"
            }
        })
        coffeeImg.height = 150
    }

}

export function loadLive2D(settings: Live2DSettings) {

    document.querySelector('#live2d-widget')?.remove()
    document.querySelector('head > script')?.remove()
    document.querySelector('#live2d-dialog-style')?.remove()
    document.querySelector('#live2d-tool-style')?.remove()
    document.querySelector('#live2d-widget-style')?.remove()
    document.querySelector('#live2d-script')?.remove()
    document.querySelector('#live2d-fontawesome')?.remove()

    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'live2d-fontawesome';
    link.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css';
    head.appendChild(link);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'live2d-script';
    script.onload = function () {
        // @ts-ignore
        eval(`L2Dwidget.init(${JSON.stringify(settings)})`)
        console.log('load success')
    }
    script.src = 'https://cdn.jsdelivr.net/gh/moelody/live2d-widget.js@v1.2.7/lib/L2Dwidget.min.js';
    document.body.append(script)
}