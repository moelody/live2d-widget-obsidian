import { Live2DSettings } from '../settings'
import { Throttle, Debounced } from '../lodash'

export class ColorPicker
{
    private value: string = '#000000';
    private containerEl: HTMLElement;
    private inputEl: HTMLDivElement;
    private popEl: HTMLDivElement;
    private pickerEl: HTMLElement;

    constructor(containerEl: HTMLElement, settings: Live2DSettings)
    {
        this.containerEl = containerEl;
        this.inputEl = createEl('div', {
            type: 'color',
            attr: { "style": "width:30px;height:30px;border-radius:10%;background:red;margin-left:1px" }
        })
        this.popEl = createEl('div', {
            type: 'color',
            attr: { id: 'colorpicker', tabIndex: 0 }
        });
        this.pickerEl = document.createElement('slider-color-picker');
        this.popEl.append(this.pickerEl);
    }

    popPicker(e: MouseEvent): void
    {
        this.popEl.style.cssText = `top:${e.clientY + 20}px;left:${e.clientX - 112}px;position:absolute;background:var(--background-secondary-alt);border-radius:3%;box-shadow:0 2px 8px var(--background-modifier-box-shadow);z-index:999;`
    }

    onChange(callback: (value: string) => void): this
    {
        this.pickerEl.addEventListener("change", new Debounced().use(e =>
        {
            this.setValue(this.pickerEl.value);
            callback(this.getValue());
        }, 100))
        this.inputEl.addEventListener('click', new Debounced().use(e =>
        {
            this.popPicker(e)
            return false;
        }, 100))
        return this;
    }

    getValue(): string
    {
        return this.value;
    }

    setValue(value: string): this
    {
        this.value = value;
        this.inputEl.style.background = value;
        this.pickerEl.value = value;
        return this;
    }

    build(): this
    {
        this.containerEl.appendChild(this.inputEl);
        document.body.append(this.popEl)

        document.addEventListener("mouseup", e =>
        {
            let target = e.target;
            let _tar = this.popEl    //获取你的目标元素
            //1. 点击事件的对象不是目标区域本身
            //2. 事件对象同时也不是目标区域的子元素
            // @ts-ignore
            if (!(target == _tar) && !_tar?.contains(target))
            {    // 目标元素外
                _tar.style.display = 'none';
            } else
            {        // 目标元素内
                //some code...
            }
        })
        return this;
    }
}