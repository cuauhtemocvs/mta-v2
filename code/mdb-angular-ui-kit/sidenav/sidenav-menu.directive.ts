import { ContentChildren, Directive, QueryList } from '@angular/core';
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';

@Directive({
  selector: '[mdbSidenavMenu]',
})
export class MdbSidenavMenuDirective {
  @ContentChildren(MdbCollapseDirective, { descendants: true })
  collapses: QueryList<MdbCollapseDirective>;
}
