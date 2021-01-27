import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appMaxLength]',
})
export class MaxLengthDirective implements AfterViewInit, OnDestroy {
  @Input() appMaxLength: number;
  private div: HTMLDivElement;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngModel: NgModel
  ) {}

  @HostListener('input', ['$event']) onChange(event): void {
    const length = this.el.nativeElement.value.length;
    if (length > this.appMaxLength) {
      this.update(length);
      event.stopPropagation();
    } else {
      this.el.nativeElement.style.border = '1px solid lightgray';
      this.renderer.setProperty(this.div, 'innerText', '');
    }
  }

  ngAfterViewInit(): void {
    this.div = this.renderer.createElement('span');
    this.div.classList.add('count');
    this.renderer.insertBefore(
      this.el.nativeElement.parentNode,
      this.div,
      this.el.nativeElement.nextSibling
    );
  }

  private update(length: number): void {
    this.renderer.setProperty(
      this.div,
      'innerText',
      `́* ${length}/${this.appMaxLength}`
    );
    this.el.nativeElement.style.border = '1px solid red';
    this.renderer.setStyle(this.div, 'color', 'red');
  }

  ngOnDestroy(): void {
    if (this.div) {
      this.div.remove();
    }
  }
}
