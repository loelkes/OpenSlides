import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

/**
 * Viewport Service
 *
 * Uses breakpoint observers to determine the size of the users/operators viewport size (the device)
 *
 * ## Example:
 *
 * Provide the service via constructor and just use it like this this
 *
 * ```html
 * <div *ngIf="!vp.isMobile">Will only be shown of not mobile</div>
 * ```
 * or
 * ```ts
 * this.vp.isMobileSubject.subscribe(mobile => (this.isMobile = mobile));
 *
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class ViewportService {
    /**
     * Simple boolean to determine whether the client is in mobile view or not
     * Use in HTML with automatic change detection
     */
    public isMobile: boolean;

    /**
     * Returns a subject that contains whether the viewport os mobile or not
     */
    public isMobileSubject = new BehaviorSubject<boolean>(false);

    /**
     * Get the BreakpointObserver
     *
     * @param breakpointObserver
     */
    public constructor(private breakpointObserver: BreakpointObserver) {}

    /**
     * Needs to be called (exactly) once.
     * Will observe breakpoints and updates the _isMobile variable
     */
    public checkForChange(): void {
        this.breakpointObserver
            .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.isMobile = true;
                    this.isMobileSubject.next(true);
                } else {
                    this.isMobile = false;
                    this.isMobileSubject.next(false);
                }
            });
    }
}
