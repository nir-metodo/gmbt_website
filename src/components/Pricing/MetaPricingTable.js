'use client';
import { useState, useMemo } from 'react';
import { FaSearch, FaGlobe, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';
import './MetaPricingTable.css';

const pricingData = [
  { country: "Afghanistan", iso: "AF", code: "93", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Albania", iso: "AL", code: "355", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Algeria", iso: "DZ", code: "213", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "American Samoa", iso: "AS", code: "1-684", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Andorra", iso: "AD", code: "376", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Angola", iso: "AO", code: "244", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Anguilla", iso: "AI", code: "1-264", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Antarctica", iso: "AQ", code: "672", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Antigua and Barbuda", iso: "AG", code: "1-268", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Argentina", iso: "AR", code: "54", marketing: 0.07725, utility: 0.0351, authentication: 0.0351, internationalAuth: null },
  { country: "Armenia", iso: "AM", code: "374", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Aruba", iso: "AW", code: "297", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Australia", iso: "AU", code: "61", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Austria", iso: "AT", code: "43", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Azerbaijan", iso: "AZ", code: "994", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Bahamas", iso: "BS", code: "1-242", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Bahrain", iso: "BH", code: "973", marketing: 0.049, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Bangladesh", iso: "BD", code: "880", marketing: 0.0915, utility: 0.004995, authentication: 0.004995, internationalAuth: 0.1296 },
  { country: "Barbados", iso: "BB", code: "1-246", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Belarus", iso: "BY", code: "375", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Belgium", iso: "BE", code: "32", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Belize", iso: "BZ", code: "501", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Benin", iso: "BJ", code: "229", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Bermuda", iso: "BM", code: "1-441", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Bhutan", iso: "BT", code: "975", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Bolivia", iso: "BO", code: "591", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Bosnia and Herzegovina", iso: "BA", code: "387", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Botswana", iso: "BW", code: "267", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Brazil", iso: "BR", code: "55", marketing: 0.078125, utility: 0.00918, authentication: 0.00918, internationalAuth: null },
  { country: "British Indian Ocean Territory", iso: "IO", code: "246", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "British Virgin Islands", iso: "VG", code: "1-284", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Brunei", iso: "BN", code: "673", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Bulgaria", iso: "BG", code: "359", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Burkina Faso", iso: "BF", code: "226", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Burundi", iso: "BI", code: "257", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Cambodia", iso: "KH", code: "855", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Cameroon", iso: "CM", code: "237", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Canada", iso: "CA", code: "1", marketing: 0.03125, utility: 0.00459, authentication: 0.00459, internationalAuth: null },
  { country: "Cape Verde", iso: "CV", code: "238", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Cayman Islands", iso: "KY", code: "1-345", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Central African Republic", iso: "CF", code: "236", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Chad", iso: "TD", code: "235", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Chile", iso: "CL", code: "56", marketing: 0.111125, utility: 0.027, authentication: 0.027, internationalAuth: null },
  { country: "China", iso: "CN", code: "86", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Christmas Island", iso: "CX", code: "61", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Cocos Islands", iso: "CC", code: "61", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Colombia", iso: "CO", code: "57", marketing: 0.015625, utility: 0.00108, authentication: 0.00108, internationalAuth: null },
  { country: "Comoros", iso: "KM", code: "269", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Cook Islands", iso: "CK", code: "682", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Costa Rica", iso: "CR", code: "506", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Croatia", iso: "HR", code: "385", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Cuba", iso: "CU", code: "53", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Curacao", iso: "CW", code: "599", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Cyprus", iso: "CY", code: "357", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Czech Republic", iso: "CZ", code: "420", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Democratic Republic of the Congo", iso: "CD", code: "243", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Denmark", iso: "DK", code: "45", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Djibouti", iso: "DJ", code: "253", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Dominica", iso: "DM", code: "1-767", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Dominican Republic", iso: "DO", code: "1-809, 1-829, 1-849", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "East Timor", iso: "TL", code: "670", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Ecuador", iso: "EC", code: "593", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Egypt", iso: "EG", code: "20", marketing: 0.0805, utility: 0.00486, authentication: 0.00486, internationalAuth: 0.08775 },
  { country: "El Salvador", iso: "SV", code: "503", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Equatorial Guinea", iso: "GQ", code: "240", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Eritrea", iso: "ER", code: "291", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Estonia", iso: "EE", code: "372", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Ethiopia", iso: "ET", code: "251", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Falkland Islands", iso: "FK", code: "500", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Faroe Islands", iso: "FO", code: "298", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Fiji", iso: "FJ", code: "679", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Finland", iso: "FI", code: "358", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "France", iso: "FR", code: "33", marketing: 0.107375, utility: 0.0405, authentication: 0.0405, internationalAuth: null },
  { country: "French Polynesia", iso: "PF", code: "689", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Gabon", iso: "GA", code: "241", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Gambia", iso: "GM", code: "220", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Georgia", iso: "GE", code: "995", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Germany", iso: "DE", code: "49", marketing: 0.170625, utility: 0.07425, authentication: 0.07425, internationalAuth: null },
  { country: "Ghana", iso: "GH", code: "233", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Gibraltar", iso: "GI", code: "350", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Greece", iso: "GR", code: "30", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Greenland", iso: "GL", code: "299", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Grenada", iso: "GD", code: "1-473", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Guam", iso: "GU", code: "1-671", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Guatemala", iso: "GT", code: "502", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Guernsey", iso: "GG", code: "44-1481", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Guinea", iso: "GN", code: "224", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Guinea-Bissau", iso: "GW", code: "245", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Guyana", iso: "GY", code: "592", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Haiti", iso: "HT", code: "509", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Honduras", iso: "HN", code: "504", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Hong Kong", iso: "HK", code: "852", marketing: 0.0915, utility: 0.0351, authentication: 0.0351, internationalAuth: null },
  { country: "Hungary", iso: "HU", code: "36", marketing: 0.1075, utility: 0.04725, authentication: 0.04725, internationalAuth: null },
  { country: "Iceland", iso: "IS", code: "354", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "India", iso: "IN", code: "91", marketing: 0.01475, utility: 0.00189, authentication: 0.00189, internationalAuth: 0.04104 },
  { country: "Indonesia", iso: "ID", code: "62", marketing: 0.051375, utility: 0.03375, authentication: 0.03375, internationalAuth: 0.1836 },
  { country: "Iran", iso: "IR", code: "98", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Iraq", iso: "IQ", code: "964", marketing: 0.042625, utility: 0.010665, authentication: 0.010665, internationalAuth: 0.1728 },
  { country: "Ireland", iso: "IE", code: "353", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Isle of Man", iso: "IM", code: "44-1624", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Israel", iso: "IL", code: "972", marketing: 0.0442, utility: 0.0067, authentication: 0.0067, internationalAuth: null },
  { country: "Italy", iso: "IT", code: "39", marketing: 0.099375, utility: 0.0405, authentication: 0.0405, internationalAuth: null },
  { country: "Ivory Coast", iso: "CI", code: "225", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Jamaica", iso: "JM", code: "1-876", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Japan", iso: "JP", code: "81", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Jersey", iso: "JE", code: "44-1534", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Jordan", iso: "JO", code: "962", marketing: 0.049, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Kazakhstan", iso: "KZ", code: "7", marketing: 0.0755, utility: 0.0243, authentication: 0.0243, internationalAuth: 0.216 },
  { country: "Kenya", iso: "KE", code: "254", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Kiribati", iso: "KI", code: "686", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Kosovo", iso: "XK", code: "383", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Kuwait", iso: "KW", code: "965", marketing: 0.099, utility: 0.0594, authentication: 0.0594, internationalAuth: 0.162 },
  { country: "Kyrgyzstan", iso: "KG", code: "996", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Laos", iso: "LA", code: "856", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Latvia", iso: "LV", code: "371", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Lebanon", iso: "LB", code: "961", marketing: 0.049, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Lesotho", iso: "LS", code: "266", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Liberia", iso: "LR", code: "231", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Libya", iso: "LY", code: "218", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Liechtenstein", iso: "LI", code: "423", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Lithuania", iso: "LT", code: "370", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Luxembourg", iso: "LU", code: "352", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Macau", iso: "MO", code: "853", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Macedonia", iso: "MK", code: "389", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Madagascar", iso: "MG", code: "261", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Malawi", iso: "MW", code: "265", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Malaysia", iso: "MY", code: "60", marketing: 0.1075, utility: 0.0189, authentication: 0.0189, internationalAuth: 0.05643 },
  { country: "Maldives", iso: "MV", code: "960", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Mali", iso: "ML", code: "223", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Malta", iso: "MT", code: "356", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Marshall Islands", iso: "MH", code: "692", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Mauritania", iso: "MR", code: "222", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Mauritius", iso: "MU", code: "230", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Mayotte", iso: "YT", code: "262", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Mexico", iso: "MX", code: "52", marketing: 0.049625, utility: 0.011475, authentication: 0.011475, internationalAuth: null },
  { country: "Micronesia", iso: "FM", code: "691", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Moldova", iso: "MD", code: "373", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Monaco", iso: "MC", code: "377", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Mongolia", iso: "MN", code: "976", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Montenegro", iso: "ME", code: "382", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Montserrat", iso: "MS", code: "1-664", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Morocco", iso: "MA", code: "212", marketing: 0.05175, utility: 0.03105, authentication: 0.03105, internationalAuth: 0.109485 },
  { country: "Mozambique", iso: "MZ", code: "258", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Myanmar", iso: "MM", code: "95", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Namibia", iso: "NA", code: "264", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Nauru", iso: "NR", code: "674", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Nepal", iso: "NP", code: "977", marketing: 0.0915, utility: 0.00459, authentication: 0.00459, internationalAuth: 0.1512 },
  { country: "Netherlands", iso: "NL", code: "31", marketing: 0.199625, utility: 0.0675, authentication: 0.0675, internationalAuth: null },
  { country: "Netherlands Antilles", iso: "AN", code: "599", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "New Caledonia", iso: "NC", code: "687", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "New Zealand", iso: "NZ", code: "64", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Nicaragua", iso: "NI", code: "505", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Niger", iso: "NE", code: "227", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Nigeria", iso: "NG", code: "234", marketing: 0.0645, utility: 0.009045, authentication: 0.009045, internationalAuth: 0.10125 },
  { country: "Niue", iso: "NU", code: "683", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "North Korea", iso: "KP", code: "850", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Northern Mariana Islands", iso: "MP", code: "1-670", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Norway", iso: "NO", code: "47", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Oman", iso: "OM", code: "968", marketing: 0.042625, utility: 0.033345, authentication: 0.033345, internationalAuth: 0.081 },
  { country: "Other", iso: "XX", code: "", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Pakistan", iso: "PK", code: "92", marketing: 0.059125, utility: 0.02025, authentication: 0.02025, internationalAuth: 0.10125 },
  { country: "Palau", iso: "PW", code: "680", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Palestine", iso: "PS", code: "970", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Panama", iso: "PA", code: "507", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Papua New Guinea", iso: "PG", code: "675", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Paraguay", iso: "PY", code: "595", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Peru", iso: "PE", code: "51", marketing: 0.087875, utility: 0.0405, authentication: 0.0405, internationalAuth: null },
  { country: "Philippines", iso: "PH", code: "63", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Pitcairn", iso: "PN", code: "64", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Poland", iso: "PL", code: "48", marketing: 0.04575, utility: 0.01647, authentication: 0.01647, internationalAuth: null },
  { country: "Portugal", iso: "PT", code: "351", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Puerto Rico", iso: "PR", code: "1-787, 1-939", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Qatar", iso: "QA", code: "974", marketing: 0.042625, utility: 0.0162, authentication: 0.0162, internationalAuth: null },
  { country: "Republic of the Congo", iso: "CG", code: "242", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Reunion", iso: "RE", code: "262", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Romania", iso: "RO", code: "40", marketing: 0.1075, utility: 0.03915, authentication: 0.03915, internationalAuth: null },
  { country: "Russia", iso: "RU", code: "7", marketing: 0.10025, utility: 0.054, authentication: 0.054, internationalAuth: null },
  { country: "Rwanda", iso: "RW", code: "250", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Saint Barthelemy", iso: "BL", code: "590", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saint Helena", iso: "SH", code: "290", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saint Kitts and Nevis", iso: "KN", code: "1-869", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saint Lucia", iso: "LC", code: "1-758", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saint Martin", iso: "MF", code: "590", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saint Pierre and Miquelon", iso: "PM", code: "508", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saint Vincent and the Grenadines", iso: "VC", code: "1-784", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Samoa", iso: "WS", code: "685", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "San Marino", iso: "SM", code: "378", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Sao Tome and Principe", iso: "ST", code: "239", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Saudi Arabia", iso: "SA", code: "966", marketing: 0.072, utility: 0.014445, authentication: 0.014445, internationalAuth: 0.08073 },
  { country: "Senegal", iso: "SN", code: "221", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Serbia", iso: "RS", code: "381", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Seychelles", iso: "SC", code: "248", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Sierra Leone", iso: "SL", code: "232", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Singapore", iso: "SG", code: "65", marketing: 0.0915, utility: 0.0216, authentication: 0.0216, internationalAuth: null },
  { country: "Sint Maarten", iso: "SX", code: "1-721", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Slovakia", iso: "SK", code: "421", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Slovenia", iso: "SI", code: "386", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Solomon Islands", iso: "SB", code: "677", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Somalia", iso: "SO", code: "252", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "South Africa", iso: "ZA", code: "27", marketing: 0.047375, utility: 0.012825, authentication: 0.012825, internationalAuth: 0.027 },
  { country: "South Korea", iso: "KR", code: "82", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "South Sudan", iso: "SS", code: "211", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Spain", iso: "ES", code: "34", marketing: 0.088375, utility: 0.027, authentication: 0.027, internationalAuth: null },
  { country: "Sri Lanka", iso: "LK", code: "94", marketing: 0.0915, utility: 0.0027, authentication: 0.0027, internationalAuth: 0.1944 },
  { country: "Sudan", iso: "SD", code: "249", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Suriname", iso: "SR", code: "597", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Svalbard and Jan Mayen", iso: "SJ", code: "47", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Swaziland", iso: "SZ", code: "268", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Sweden", iso: "SE", code: "46", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Switzerland", iso: "CH", code: "41", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Syria", iso: "SY", code: "963", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Taiwan", iso: "TW", code: "886", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Tajikistan", iso: "TJ", code: "992", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Tanzania", iso: "TZ", code: "255", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Thailand", iso: "TH", code: "66", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Togo", iso: "TG", code: "228", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Tokelau", iso: "TK", code: "690", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Tonga", iso: "TO", code: "676", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Trinidad and Tobago", iso: "TT", code: "1-868", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Tunisia", iso: "TN", code: "216", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Turkey", iso: "TR", code: "90", marketing: 0.013625, utility: 0.001215, authentication: 0.001215, internationalAuth: null },
  { country: "Turkmenistan", iso: "TM", code: "993", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Turks and Caicos Islands", iso: "TC", code: "1-649", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Tuvalu", iso: "TV", code: "688", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "U.S. Virgin Islands", iso: "VI", code: "1-340", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Uganda", iso: "UG", code: "256", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Ukraine", iso: "UA", code: "380", marketing: 0.1075, utility: 0.04023, authentication: 0.04023, internationalAuth: 0.10071 },
  { country: "United Arab Emirates", iso: "AE", code: "971", marketing: 0.072, utility: 0.021195, authentication: 0.021195, internationalAuth: 0.06885 },
  { country: "United Kingdom", iso: "GB", code: "44", marketing: 0.079375, utility: 0.0297, authentication: 0.0297, internationalAuth: null },
  { country: "United States", iso: "US", code: "1", marketing: 0.03125, utility: 0.00459, authentication: 0.00459, internationalAuth: null },
  { country: "Uruguay", iso: "UY", code: "598", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Uzbekistan", iso: "UZ", code: "998", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Vanuatu", iso: "VU", code: "678", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Vatican", iso: "VA", code: "379", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Venezuela", iso: "VE", code: "58", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Vietnam", iso: "VN", code: "84", marketing: 0.10525, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Wallis and Futuna", iso: "WF", code: "681", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Western Sahara", iso: "EH", code: "212", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Yemen", iso: "YE", code: "967", marketing: 0.049, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Zambia", iso: "ZM", code: "260", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Zimbabwe", iso: "ZW", code: "263", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
];

export default function MetaPricingTable() {
  const { currentLanguage } = useLanguage();
  const isHe = currentLanguage !== 'en';
  const dir = isHe ? 'rtl' : 'ltr';

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredData = useMemo(() => {
    return pricingData.filter(row =>
      row.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.code.includes(searchTerm)
    );
  }, [searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? -1;
      const bVal = b[sortConfig.key] ?? -1;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="meta-pricing-container" dir={dir} style={{ paddingTop: '68px' }}>
      <div className="meta-pricing-header">
        <div className="header-badge">
          <MdVerified className="badge-icon" />
          <span>{isHe ? 'מחירים רשמיים' : 'Official Pricing'}</span>
        </div>
        <h1 className="meta-pricing-title">
          <FaGlobe className="title-icon" />
          {isHe ? 'מחירון Meta WhatsApp - תשלום לפי הודעה' : 'Meta WhatsApp Pricing - Pay Per Message'}
        </h1>
        <p className="meta-pricing-subtitle">
          {isHe
            ? 'עלות הודעה בדולר לפי מדינה – עודכן ב-1 באוקטובר 2026'
            : 'Cost per message in USD by country. Updated October 1, 2026'}
        </p>
        <div className="pricing-notes">
          <div className="note-item">
            <FaMoneyBillWave className="note-icon" />
            <span>{isHe ? 'המחירים המוצגים כאן הם עבור תכנית Growth/Pro' : 'Prices shown are for Growth/Pro Plan'}</span>
          </div>
          <div className="note-item">
            <FaChartLine className="note-icon" />
            <span>{isHe ? 'עבור תכנית Business יש הנחה נוספת על התעריף' : 'Business plan gets additional discount'}</span>
          </div>
        </div>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={isHe ? 'חפש מדינה, קוד ISO או קידומת...' : 'Search country, ISO code or prefix...'}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pricing-table-wrapper">
        <table className="meta-pricing-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('country')}>
                {isHe ? 'מדינה' : 'Country Name'}
                {sortConfig.key === 'country' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('iso')}>
                {isHe ? 'קוד ISO' : 'ISO Code'}
                {sortConfig.key === 'iso' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('code')}>
                {isHe ? 'קידומת' : 'Country Codes'}
                {sortConfig.key === 'code' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('marketing')} className="price-column">
                {isHe ? 'שיווק' : 'Marketing'}
                {sortConfig.key === 'marketing' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('utility')} className="price-column">
                {isHe ? 'שירות' : 'Utility'}
                {sortConfig.key === 'utility' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('authentication')} className="price-column">
                {isHe ? 'אימות' : 'Authentication'}
                {sortConfig.key === 'authentication' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('internationalAuth')} className="price-column">
                {isHe ? 'אימות בינלאומי' : 'International Auth*'}
                {sortConfig.key === 'internationalAuth' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx}>
                <td className="country-cell">{row.country}</td>
                <td className="iso-cell">{row.iso}</td>
                <td className="code-cell">{row.code}</td>
                <td className="price-cell">${row.marketing.toFixed(6)}</td>
                <td className="price-cell">${row.utility.toFixed(6)}</td>
                <td className="price-cell">${row.authentication.toFixed(6)}</td>
                <td className="price-cell">{row.internationalAuth ? `$${row.internationalAuth.toFixed(6)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pricing-footer">
        <p className="footer-note">
          <strong>*</strong> {isHe
            ? 'אימות בינלאומי זמין רק במדינות מסוימות'
            : 'International Authentication is only available for specific countries'}
        </p>
        <p className="footer-note">
          {isHe
            ? 'כל הודעות השירות חינמיות עבור לקוחות תכנית Growth/Pro/Business'
            : 'All service messages are free for Growth/Pro/Business plan customers'}
        </p>
      </div>
    </div>
  );
}
