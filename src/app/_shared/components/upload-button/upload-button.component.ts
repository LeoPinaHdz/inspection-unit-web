import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  templateUrl: 'upload-button.component.html',
  selector: 'upload-button',
  styleUrls: ['upload-button.component.scss']
})

export class UploadButtonComponent {
  @Input() buttonTitle: string = 'Subir Archivo';
  @Input() accept:string = '*';
  @Output() fileChange = new EventEmitter<FileList>();
  
  fileChanged(event: any){
    const files = event.target.files;
    if (files){
      this.fileChange.emit(files);
    } else {
      this.fileChange.emit();
    }
  }
}