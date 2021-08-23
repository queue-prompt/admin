export const formatMonthEngToThai = (month) => {
  switch (month) {
    case 'January': {
      return 'มกราคม'
    }
    case 'February': {
      return 'กุมภาพันธ์'
    }
    case 'March': {
      return 'มีนาคม'
    }
    case 'April': {
      return 'เมษายน'
    }
    case 'May': {
      return 'พฤษภาคม'
    }
    case 'June': {
      return 'มิถุนายน'
    }
    case 'July': {
      return 'กรกฎาคม'
    }
    case 'August': {
      return 'สิงหาคม'
    }
    case 'September': {
      return 'กันยายน'
    }
    case 'October': {
      return 'ตุลาคม'
    }
    case 'November':{
      return 'พฤศจิกายน'
    }
    case 'December':{
      return 'ธันวาคม'
    }
  }
}