import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';
import * as moment from 'moment';
import 'moment/locale/pt-br';

import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public cpf1: any;
  cpf2: string = '';
  cpf3: string = '';
  dirPath;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public nativeStorage: NativeStorage, private file: File) {

  }

  getCPFs() {
    if ((typeof this.cpf1 != 'undefined' && this.cpf1)) {
      this.getCPF(this.cpf1);
    }
    if ((typeof this.cpf2 != 'undefined' && this.cpf2)) {
      this.getCPF(this.cpf2);
    }
    if ((typeof this.cpf3 != 'undefined' && this.cpf3)) {
      this.getCPF(this.cpf3);
    }

    if (
      (typeof this.cpf1 != 'undefined' && this.cpf1) ||
      (typeof this.cpf2 != 'undefined' && this.cpf2) ||
      (typeof this.cpf3 != 'undefined' && this.cpf3)) {
        let alertaOk = this.alertCtrl.create({ title: "Registro Ok" });
        alertaOk.present();
        this.cpf1 = '';
        this.cpf2 = '';
        this.cpf3 = '';
    }

  }

  getCPF(cpfParam) {
    console.log("OK " + cpfParam);
    let result = this.file.createDir(this.file.externalRootDirectory, "EXCELENTE", true);
    result.then(data => {
      this.dirPath = data.toURL();
      let now = moment().format();
      this.file.writeFile(this.dirPath, cpfParam, cpfParam + "@" + now, { replace: true }).then(salvo => {
        this.file.readAsText(this.dirPath, cpfParam).then(lido => {
          let blob = new Blob([lido], { type: "text/plain" });
          let uploadTask = firebase.storage().ref('/pasta1').child(cpfParam + ".txt").put(blob);
        }).catch(err => {
          let alertaErro = this.alertCtrl.create({ title: "Erro: " + err });
          alertaErro.present();
        });
      }).catch(err => {
        let alertaErro = this.alertCtrl.create({ title: "Erro: " + err });
        alertaErro.present();
      });

      //Persistir CPF e data em que foi enviado.
      this.nativeStorage.setItem('cpf', { property: cpfParam })
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );

    }).catch(err => {
      let alertaErro = this.alertCtrl.create({ title: "Erro: " + err });
      alertaErro.present();
    });
  }

}
