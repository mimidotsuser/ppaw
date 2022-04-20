import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Actions, Resources } from '../../utils/permissions';

@Directive({
  selector: '[can]'
})
export class CanDirective implements OnInit {

  @Input() can?: `${keyof typeof Resources}.${keyof typeof Actions}`

  @Input() set canElse(template: TemplateRef<any>) {this.fallback = template};

  private fallback?: TemplateRef<any>

  constructor(private authService: AuthService, private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {

  }

  ngOnInit(): void {
    if (!this.can) {return}

    const params = this.can.split('.');
    const resourceKey = params[ 0 ] as keyof typeof Resources
    const actionKey = params[ 1 ] as keyof typeof Actions

    if (this.authService.can(Resources[ resourceKey ], Actions[ actionKey ])) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      if (this.fallback) {
        this.viewContainer.createEmbeddedView(this.fallback);
      } else {
        this.viewContainer.clear();
      }
    }
  }


}
