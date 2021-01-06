import { IconCode } from '../Enum/IconCode.enum';

export class IconHelper {
  static getIconPath(iconCode: number): string {
    let ret = '';
    switch (iconCode) {
      // xe tai
      case IconCode.Trucks: {
        ret = '../assets/icons/vehicles/truck/Blue0.png';
        break;
      }
      // xe may
      case IconCode.Motorcycles: {
        ret = '../assets/icons/vehicles/motobike/Blue0.png';
        break;
      }
      // xe bus
      case IconCode.Bus: {
        ret = '../assets/icons/vehicles/bus/Blue0.png';
        break;
      }
      // oto
      case IconCode.Cars: {
        ret = '../assets/icons/vehicles/car/Blue0.png';
        break;
      }
      // tau thuyen
      case IconCode.Boat: {
        ret = '../assets/icons/vehicles/boat/Blue0.png';
        break;
      }
      // taxi
      case IconCode.Taxi: {
        ret = '../assets/icons/vehicles/taxi/Blue0.png';
        break;
      }

      // Xe cu ho
      case IconCode.Rescue: {
        ret = '../assets/icons/vehicles/rescue/Blue0.png';
        break;
      }

      // Icon xe ben V1
      case IconCode.CarsV1: {
        ret = '../assets/icons/vehicles/car_v1/Blue0.png';
        break;
      }

      // Tau hoa
      case IconCode.Train:
        ret = '../assets/icons/vehicles/train/Blue0.png';
        break;

      // Xe bon
      case IconCode.Tank: {
        ret = '../assets/icons/vehicles/tank/Blue0.png';
        break;
      }

      // Xe ben
      case IconCode.Tipper: {
        ret = '../assets/icons/vehicles/tipper/Blue0.png';
        break;
      }

      // Xe co mui ten
      case IconCode.ArrowCars: {
        ret = '../assets/icons/vehicles/arrowCars/Blue0.png';
        break;
      }

      // Xe rac to
      case IconCode.Trash: {
        ret = '../assets/icons/vehicles/trash/Blue0.png';
        break;
      }

      // Xe rac nho
      case IconCode.Trash2: {
        ret = '../assets/icons/vehicles/trash2/Blue0.png';
        break;
      }

      // Xe may moi
      case IconCode.Motobike2: {
        ret = '../assets/icons/vehicles/motobike2/Blue0.png';
        break;
      }

      // May xuc
      case IconCode.Excavator: {
        ret = '../assets/icons/vehicles/excavator/Blue0.png';
        break;
      }

      // Xe phat dien
      case IconCode.Electric: {
        ret = '../assets/icons/vehicles/electric/Blue0.png';
        break;
      }

      default:
        ret = '../assets/icons/vehicles/ball/Blue1.png';
        break;
    }
    return ret;
  }
}
