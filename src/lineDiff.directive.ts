import { Directive, ElementRef, Input, OnChanges} from '@angular/core';
import { DiffMatchPatchService } from './diffMatchPatch.service';

@Directive({
  selector: '[lineDiff]',
})
export class LineDiffDirective implements OnChanges {
  @Input() left: string | number | boolean;
  @Input() right: string | number | boolean;
  @Input() showAsHtml: boolean = true;

  constructor(private el: ElementRef, private dmp: DiffMatchPatchService) {  }

  ngOnInit () {
    this.makeDiff();
  }

  ngOnChanges(changes) {
    if (changes.showAsHtml !== undefined && changes.showAsHtml.currentValue !== changes.showAsHtml.previousValue) {
      this.makeDiff();
    }
  }

  private makeDiff() {
    if(typeof this.left === 'number' || typeof this.left === 'boolean') this.left = this.left.toString();
    if(typeof this.right === 'number' || typeof this.right === 'boolean') this.right = this.right.toString();
    var diffs = this.dmp.getLineDiff(this.left, this.right);
    var diffContent = this.createHtml(diffs);
    if (this.showAsHtml)
      this.el.nativeElement.innerHTML = diffContent;
    else
      this.el.nativeElement.innerText = diffContent;
  }  
  // TODO: Need to fix this for line diffs
  createHtml (diffs) {
    var html: string;
    html = "<div>"
    for(let diff of diffs) {
      if(diff[0] == 0) {
        html += diff[1];
      }
      if(diff[0] == -1) {
        html += "<div class=\"del\"> - <del>" + diff[1] + "</del></div>\n";
      }
      if(diff[0] == 1) {
        html += "<div class=\"ins\"> + <ins>" + diff[1] + "</ins></div>\n";
      }
    }
    html += "</div>"
    return html;
  }
}
