import { Directive, ElementRef, Input, OnChanges} from '@angular/core';
import { DiffMatchPatchService } from './diffMatchPatch.service';

@Directive({
  selector: '[processingDiff]'
})
export class ProcessingDiffDirective implements OnChanges { 
  @Input() left: string;
  @Input() right: string;
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
    var diffs = this.dmp.getProcessingDiff(this.left, this.right);
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
      //diff[1] = diff[1].replace(/\n/g, '<br/>');

      if(diff[0] == 0) {
        html += diff[1];
      }
      if(diff[0] == -1) {
        html += "<del>" + diff[1] + "</del>";
      }
      if(diff[0] == 1) {
        html += "<ins>" + diff[1] + "</ins>";
      }
    }
    html += "</div>"
    return html;
  }

}