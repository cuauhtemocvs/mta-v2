import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { first, fromEvent, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const MDB_MULTI_RANGE = new InjectionToken<{}>('MDB_MULTI_RANGE');

@Directive({
  selector: '[mdbMultiRangeThumb]',
  exportAs: 'mdbMultiRangeThumb',
})
export class MdbMultiRangeThumbDirective implements OnInit, OnDestroy {
  @Input()
  get step(): number {
    return this._step;
  }
  set step(value: NumberInput) {
    this._step = coerceNumberProperty(value);
  }
  private _step = 0;

  @Input()
  get min(): number {
    return this._min;
  }
  set min(value: NumberInput) {
    this._min = coerceNumberProperty(value);
  }
  private _min = 0;

  @Input()
  get max(): number {
    return this._max;
  }
  set max(value: NumberInput) {
    this._max = coerceNumberProperty(value);
  }
  private _max = 100;

  @Input()
  get startValue(): number {
    return this._startValue;
  }
  set startValue(value: NumberInput) {
    this._startValue = coerceNumberProperty(value);
  }
  private _startValue = 0;

  private _numberOfAvailableValues = 0;
  private _sliderWidth = 0;
  private readonly _destroy$: Subject<void> = new Subject<void>();

  private _maxPosition: number;
  private _minPosition: number;

  showTooltip = false;
  sliderEl!: HTMLElement;
  coordinates: { initialX: number; currentX: number } = { initialX: 0, currentX: 0 };
  get host(): HTMLSpanElement {
    return this._elementRef.nativeElement;
  }
  readonly THUMB_WIDTH = 16;

  @Output() readonly startDrag = new EventEmitter<void>();
  @Output() readonly changeValue = new EventEmitter<void>();
  @Output() readonly pointerMove = new EventEmitter<void>();

  constructor(
    private _elementRef: ElementRef,
    @Inject(DOCUMENT) private _document: any,
    private _ngZone: NgZone,
    private _cdRef: ChangeDetectorRef,
    @Inject(MDB_MULTI_RANGE) private _multiRange: any
  ) {}

  private _getOffsetLeft(): number {
    if (this.coordinates.currentX > this._sliderWidth) {
      return this._sliderWidth;
    }

    if (this.coordinates.currentX <= 0) {
      return 0;
    }

    if (this._step > 0) {
      const currentStep =
        Math.round(
          this.coordinates.currentX / (this._sliderWidth / this._numberOfAvailableValues)
        ) / this._step;
      const stepWidth =
        this._sliderWidth / (this._numberOfAvailableValues / (this._step ? this._step : 1));
      return stepWidth * currentStep;
    }

    return this.coordinates.currentX;
  }

  private _updateState(event: MouseEvent | TouchEvent): void {
    let clientX = 0;

    if (event instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }

    let isBoundary = false;
    if (clientX - this.coordinates.initialX < this._minPosition) {
      this.coordinates.currentX = this._minPosition;
      isBoundary = true;
    }

    if (clientX - this.coordinates.initialX > this._maxPosition) {
      this.coordinates.currentX = this._maxPosition;
      isBoundary = true;
    }

    if (!isBoundary && this._step < 1) {
      this.coordinates.currentX = clientX - this.coordinates.initialX;
    }

    if (
      this._step > 0 &&
      Math.round(
        (clientX - this.coordinates.initialX) / (this._sliderWidth / this._numberOfAvailableValues)
      ) %
        this._step !=
        0
    ) {
      return;
    }

    if (this._step > 0) {
      this.coordinates.currentX = clientX - this.coordinates.initialX;
    }

    this.host.style.left = `${this._getOffsetLeft()}px`;
  }

  private _initValues(): void {
    if (this._startValue > this._max) {
      this._startValue = this._max;
    }

    if (this._startValue < this._min) {
      this._startValue = this._min;
    }

    this.sliderEl = this.host.parentElement;
    this._sliderWidth = this.sliderEl.offsetWidth - this.THUMB_WIDTH;

    this.coordinates.currentX =
      (this._sliderWidth / this._numberOfAvailableValues) * (this._startValue - this._min);
    this._maxPosition = this._getMaxPosition();
    this._minPosition = this._getMinPosition();
    this.host.style.left = `${this._getOffsetLeft()}px`;
  }

  _updateThumbPosition(value: number) {
    if (value > this._maxPosition) {
      value = this._maxPosition;
    }

    if (value < this._minPosition) {
      value = this._minPosition;
    }

    this.sliderEl = this.host.parentElement;
    this._sliderWidth = this.sliderEl.offsetWidth - this.THUMB_WIDTH;
    this.coordinates.currentX =
      (this._sliderWidth / this._numberOfAvailableValues) * (value - this._min);

    this.host.style.left = `${this._getOffsetLeft()}px`;
  }

  private _initDrag(): void {
    this._ngZone.runOutsideAngular(() => {
      const pointerStart$ = merge(
        fromEvent<MouseEvent>(this.host, 'mousedown'),
        fromEvent<TouchEvent>(this.host, 'touchstart')
      );

      const pointerEnd$ = merge(
        fromEvent<MouseEvent>(this._document, 'mouseup'),
        fromEvent<TouchEvent>(this._document, 'touchend')
      );

      const pointerDrag$ = merge(
        fromEvent<MouseEvent>(this._document, 'mousemove'),
        fromEvent<TouchEvent>(this._document, 'touchmove')
      );

      pointerStart$.pipe(takeUntil(this._destroy$)).subscribe((event: MouseEvent | TouchEvent) => {
        let clientX = 0;

        if (event instanceof TouchEvent) {
          clientX = event.touches[0].clientX;
        } else {
          clientX = event.clientX;
        }
        this._maxPosition = this._getMaxPosition();
        this._minPosition = this._getMinPosition();
        this.coordinates.initialX = clientX - this.coordinates.currentX;
        this.host.classList.add('thumb-dragging');
        this.showTooltip = true;
        this.startDrag.emit();
        this._cdRef.detectChanges();

        pointerDrag$.pipe(takeUntil(pointerEnd$)).subscribe((event: MouseEvent | TouchEvent) => {
          this._ngZone.run(() => {
            event.preventDefault();
            this._updateState(event);
            this.pointerMove.emit();
          });
        });

        pointerEnd$.pipe(first()).subscribe(() => {
          this._ngZone.run(() => {
            this.showTooltip = false;
            this.host.classList.remove('thumb-dragging');
            this.changeValue.emit();
          });
          this._cdRef.detectChanges();
        });
      });
    });
  }

  ngOnInit(): void {
    this._numberOfAvailableValues = this._max - this._min > 0 ? this._max - this._min : 1;
    this._initValues();
    this._initDrag();

    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._ngZone.runOutsideAngular(() => {
            const newSliderWidth = this.sliderEl.offsetWidth - this.THUMB_WIDTH;
            const scale = this._sliderWidth / newSliderWidth;

            this.coordinates.currentX = this.coordinates.currentX / scale;
            this._sliderWidth = newSliderWidth;

            this.host.style.left = `${this._getOffsetLeft()}px`;
          });
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _getThumbs() {
    let previousThumb = null;
    let nextThumb = null;
    const thumbs = this._multiRange.rangeThumbs?.toArray();
    if (thumbs?.length > 1) {
      const thumbIndex = this._multiRange.rangeThumbs.toArray().indexOf(this);
      previousThumb = thumbIndex > 0 ? thumbs[thumbIndex - 1] : null;
      nextThumb = thumbIndex < thumbs.length - 1 ? thumbs[thumbIndex + 1] : null;
    }
    return { previousThumb, nextThumb };
  }

  private _getMaxPosition(): number {
    let maxPosition = this._sliderWidth;
    const { nextThumb } = this._getThumbs();
    if (nextThumb) {
      maxPosition = nextThumb.coordinates.currentX;
    }

    return maxPosition;
  }

  private _getMinPosition(): number {
    let minPosition = 0;
    const { previousThumb } = this._getThumbs();

    if (previousThumb) {
      minPosition = previousThumb.coordinates.currentX;
    }
    return minPosition;
  }
}
