/**
 * BlackCAT Transients Table Aladin Cutouts Extension
 * Generates and displays X-ray, Optical, and IR cutouts using the CDS hips2fits service.
 * Dynamic fallback priority logic:
 *   - X-ray: Chandra -> XMM -> eROSITA -> None
 *   - Optical: Pan-STARRS -> DESI -> DECaPS -> DSS2
 *   - IR: Spitzer -> 2MASS
 */

(function() {
  // 1. Embedded Precomputed Survey Coverage for the 73 current transients
  const PRECOMPUTED_COVERAGE = {
  "1": {
    "ra_deg": 210.1175,
    "dec_deg": -64.79322222222223,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "2": {
    "ra_deg": 248.5067083333333,
    "dec_deg": -47.393,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "3": {
    "ra_deg": 236.78466666666665,
    "dec_deg": -47.669666666666664,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "4": {
    "ra_deg": 269.66683333333333,
    "dec_deg": -33.80744444444444,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "5": {
    "ra_deg": 255.70583333333335,
    "dec_deg": -48.789833333333334,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "6": {
    "ra_deg": 232.07054166666668,
    "dec_deg": -61.88276388888889,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "7": {
    "ra_deg": 95.68541666666665,
    "dec_deg": -0.34575555555555554,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "8": {
    "ra_deg": 266.565,
    "dec_deg": -32.23357222222222,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "9": {
    "ra_deg": 257.0605,
    "dec_deg": -25.091708333333333,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "10": {
    "ra_deg": 267.454,
    "dec_deg": -33.204750000000004,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "11": {
    "ra_deg": 282.32104166666664,
    "dec_deg": -3.06535,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "12": {
    "ra_deg": 209.54041666666666,
    "dec_deg": -64.73494444444445,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "13": {
    "ra_deg": 300.7061666666667,
    "dec_deg": 25.23648888888889,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "14": {
    "ra_deg": 264.0083333333333,
    "dec_deg": -27.428055555555556,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "15": {
    "ra_deg": 306.0159166666666,
    "dec_deg": 33.86719444444444,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "16": {
    "ra_deg": 171.61104166666667,
    "dec_deg": -68.67578611111112,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "17": {
    "ra_deg": 65.42829166666667,
    "dec_deg": 32.90752777777777,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "18": {
    "ra_deg": 288.798125,
    "dec_deg": 10.945777777777778,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "19": {
    "ra_deg": 153.40141666666668,
    "dec_deg": -45.07541666666667,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "20": {
    "ra_deg": 259.90387499999997,
    "dec_deg": -25.017619444444442,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "21": {
    "ra_deg": 253.50058333333328,
    "dec_deg": -39.84580555555556,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "22": {
    "ra_deg": 263.3833333333334,
    "dec_deg": -31.204444444444444,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "23": {
    "ra_deg": 284.17883333333333,
    "dec_deg": 5.309527777777777,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "24": {
    "ra_deg": 265.66679166666665,
    "dec_deg": -27.747972222222224,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "25": {
    "ra_deg": 265.0375,
    "dec_deg": -31.040000000000003,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "26": {
    "ra_deg": 268.8691666666667,
    "dec_deg": -32.4775,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "27": {
    "ra_deg": 237.74458333333337,
    "dec_deg": -56.476444444444446,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "28": {
    "ra_deg": 267.02108333333337,
    "dec_deg": -28.47383333333333,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "29": {
    "ra_deg": 303.157125,
    "dec_deg": 38.183638888888886,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "30": {
    "ra_deg": 274.8399166666666,
    "dec_deg": -25.406972222222223,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "31": {
    "ra_deg": 284.67325,
    "dec_deg": 22.658166666666666,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "32": {
    "ra_deg": 169.54495833333334,
    "dec_deg": 48.03678333333333,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "33": {
    "ra_deg": 252.5040833333333,
    "dec_deg": -49.96211111111111,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "34": {
    "ra_deg": 257.90458333333333,
    "dec_deg": -38.11825,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "35": {
    "ra_deg": 287.2211666666667,
    "dec_deg": 9.384677777777778,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "36": {
    "ra_deg": 259.99579166666666,
    "dec_deg": -31.750308333333333,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "37": {
    "ra_deg": 257.2817083333333,
    "dec_deg": -36.40713888888889,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "38": {
    "ra_deg": 257.441375,
    "dec_deg": -36.46591666666667,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "39": {
    "ra_deg": 268.367875,
    "dec_deg": -1.4517277777777777,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "40": {
    "ra_deg": 274.60179166666666,
    "dec_deg": -24.538322222222224,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "41": {
    "ra_deg": 261.70533333333333,
    "dec_deg": -47.64025,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "42": {
    "ra_deg": 274.431375,
    "dec_deg": -33.018769444444445,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "43": {
    "ra_deg": 267.4085,
    "dec_deg": -28.354861111111113,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "44": {
    "ra_deg": 266.4170833333334,
    "dec_deg": -29.00177777777778,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "45": {
    "ra_deg": 280.5727083333333,
    "dec_deg": -11.41775,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "46": {
    "ra_deg": 234.79983333333334,
    "dec_deg": -62.467305555555555,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "47": {
    "ra_deg": 253.08470833333334,
    "dec_deg": -45.34444166666667,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "48": {
    "ra_deg": 268.062875,
    "dec_deg": -22.342322222222222,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "49": {
    "ra_deg": 254.75700000000003,
    "dec_deg": -15.257980555555555,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "50": {
    "ra_deg": 209.32008333333332,
    "dec_deg": -9.544041666666667,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "51": {
    "ra_deg": 235.82158333333334,
    "dec_deg": -56.413780555555554,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "52": {
    "ra_deg": 278.93104166666666,
    "dec_deg": -19.319577777777777,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "53": {
    "ra_deg": 196.73041666666668,
    "dec_deg": -70.45141944444445,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "54": {
    "ra_deg": 287.595,
    "dec_deg": -5.798866666666666,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "55": {
    "ra_deg": 266.29520833333333,
    "dec_deg": -26.403499999999998,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "56": {
    "ra_deg": 268.4160416666667,
    "dec_deg": -25.753944444444443,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "57": {
    "ra_deg": 277.2419583333333,
    "dec_deg": -25.02941111111111,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "58": {
    "ra_deg": 266.278,
    "dec_deg": -30.378694444444445,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "59": {
    "ra_deg": 266.36533333333335,
    "dec_deg": -29.33151388888889,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "60": {
    "ra_deg": 233.83212500000002,
    "dec_deg": -57.22988333333333,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "61": {
    "ra_deg": 254.55291666666662,
    "dec_deg": -42.69891388888889,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "62": {
    "ra_deg": 273.39175,
    "dec_deg": -9.533111111111111,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "63": {
    "ra_deg": 275.09141666666665,
    "dec_deg": 7.185330555555556,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "64": {
    "ra_deg": 247.80925,
    "dec_deg": -47.80651111111111,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "65": {
    "ra_deg": 273.16525,
    "dec_deg": -22.32361111111111,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "66": {
    "ra_deg": 262.24433333333326,
    "dec_deg": -36.24314444444445,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "67": {
    "ra_deg": 207.05329166666667,
    "dec_deg": -63.27457777777778,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "68": {
    "ra_deg": 99.09875,
    "dec_deg": -42.86797222222222,
    "xray": {
      "id": "erosita/dr1/rate/rgb",
      "name": "eROSITA"
    },
    "optical": {
      "id": "CDS/P/DESI-Legacy-Surveys/DR10/color",
      "name": "DESI"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "69": {
    "ra_deg": 68.84695833333333,
    "dec_deg": 55.376194444444444,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "70": {
    "ra_deg": 270.76162500000004,
    "dec_deg": -29.830472222222223,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "71": {
    "ra_deg": 261.9304583333333,
    "dec_deg": -16.205341666666666,
    "xray": null,
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "CDS/P/2MASS/color",
      "name": "2MASS"
    }
  },
  "72": {
    "ra_deg": 229.73958333333334,
    "dec_deg": -57.363527777777776,
    "xray": {
      "id": "ESDC/P/XMM/EPIC-RGB",
      "name": "XMM"
    },
    "optical": {
      "id": "CDS/P/DECaPS/DR2/color",
      "name": "DECaPS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  },
  "73": {
    "ra_deg": 266.41866666666664,
    "dec_deg": -29.012805555555556,
    "xray": {
      "id": "cxc.harvard.edu/P/cda/hips/allsky/rgb",
      "name": "Chandra"
    },
    "optical": {
      "id": "CDS/P/PanSTARRS/DR1/color-i-r-g",
      "name": "Pan-STARRS"
    },
    "ir": {
      "id": "ESAVO/P/Spitzer/IRAC134-RGB-bright",
      "name": "Spitzer"
    }
  }
};

  // 2. Constants & Survey Configurations
  const SURVEY_PRIORITIES = {
    xray: [
      { id: 'cxc.harvard.edu/P/cda/hips/allsky/rgb', name: 'Chandra' },
      { id: 'ESDC/P/XMM/EPIC-RGB', name: 'XMM' },
      { id: 'erosita/dr1/rate/rgb', name: 'eROSITA' }
    ],
    optical: [
      { id: 'CDS/P/PanSTARRS/DR1/color-i-r-g', name: 'Pan-STARRS' },
      { id: 'CDS/P/DESI-Legacy-Surveys/DR10/color', name: 'DESI' },
      { id: 'CDS/P/DECaPS/DR2/color', name: 'DECaPS' },
      { id: 'CDS/P/DSS2/color', name: 'DSS2' }
    ],
    ir: [
      { id: 'ESAVO/P/Spitzer/IRAC134-RGB-bright', name: 'Spitzer' },
      { id: 'CDS/P/2MASS/color', name: '2MASS' }
    ]
  };

  const CUTOUT_FOV = 0.025; // 1.5 arcminutes (1.5 / 60 degrees)
  const CUTOUT_SIZE = 300; // 300x300px image resolution (used for popup, scaled down for thumbnail)

  // 3. Dynamic Styles Injector
  function injectStyles() {
    const css = `
      .column-name-list {
        width: 18% !important;
        vertical-align: middle !important;
      }
      .sky-thumbnails-container {
        display: flex;
        gap: 6px;
        justify-content: flex-start;
        align-items: center;
        margin: 6px 0 2px 0;
      }
      .sky-thumbnail-wrapper {
        position: relative;
        width: 60px;
        height: 60px;
        box-sizing: border-box;
      }
      .sky-thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid rgba(0,0,0,0.1);
        background: #f7f7f7;
        cursor: pointer;
        display: block;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
      }
      .sky-thumbnail:hover {
        transform: scale(1.12);
        border-color: #337ab7;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10;
      }
      .sky-thumbnail.na {
        background: #f0f0f0;
        border: 1px dashed rgba(0,0,0,0.15);
        color: #777;
        font-size: 10px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 1.2;
        cursor: default;
        border-radius: 6px;
      }
      .sky-thumbnail.na.xray::before {
        content: "X-ray";
      }
      .sky-thumbnail.na.optical::before {
        content: "Optical";
      }
      .sky-thumbnail.na.ir::before {
        content: "IR";
      }
      .sky-thumbnail.na::after {
        content: "N/A";
        font-size: 8px;
        color: #aaa;
        font-weight: normal;
        margin-top: 2px;
      }
      .sky-thumbnails-wrapper-cell {
        margin-top: 6px;
      }
      .sky-thumbnails-wrapper-cell.invalid-coord::before {
        content: "Invalid Coord";
        color: #aaa;
        font-size: 10px;
        display: block;
        margin-top: 4px;
      }
      .sky-thumbnails-wrapper-cell.loading::before {
        content: "Loading coverage...";
        color: #888;
        font-size: 10px;
        display: block;
        margin-top: 4px;
      }
      /* Hover Popup Styling (Light Theme) */
      #sky-popup {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 1px 8px rgba(0, 0, 0, 0.06);
        width: 324px; /* 300px image + padding */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #sky-popup.visible {
        opacity: 1;
        transform: scale(1);
      }
      .sky-popup-title {
        font-size: 14px;
        font-weight: bold;
        color: #222;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sky-popup-subtitle {
        font-size: 11px;
        color: #337ab7;
        font-weight: 600;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .sky-popup-image {
        width: 300px;
        height: 300px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid rgba(0,0,0,0.08);
        background: #eee;
        display: block;
      }
      .sky-popup-coords {
        font-size: 9px;
        color: #777;
        margin-top: 6px;
        text-align: right;
      }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // 4. Helper Coordinates Converters
  function raToDegrees(raStr) {
    if (!raStr) return null;
    const parts = raStr.trim().split(':');
    if (parts.length < 3) return null;
    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
    return (h + m / 60 + s / 3600) * 15;
  }

  function decToDegrees(decStr) {
    if (!decStr) return null;
    const parts = decStr.trim().split(':');
    if (parts.length < 3) return null;
    const sign = parts[0].trim().startsWith('-') ? -1 : 1;
    const d = Math.abs(parseFloat(parts[0]));
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    if (isNaN(d) || isNaN(m) || isNaN(s)) return null;
    return sign * (d + m / 60 + s / 3600);
  }

  // 5. Dynamic MOC Query for New Transients
  async function queryMocServer(ra, dec) {
    const url = `https://alasky.cds.unistra.fr/MocServer/query?RA=${ra}&DEC=${dec}&SR=0.0001&get=record&fmt=json`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const coveredIds = data.map(item => item.ID);

      // Resolve best X-ray
      let xray = null;
      for (const s of SURVEY_PRIORITIES.xray) {
        if (coveredIds.includes(s.id)) {
          xray = s;
          break;
        }
      }

      // Resolve best optical
      let optical = null;
      for (const s of SURVEY_PRIORITIES.optical) {
        if (coveredIds.includes(s.id)) {
          optical = s;
          break;
        }
      }

      // Resolve best IR
      let ir = null;
      for (const s of SURVEY_PRIORITIES.ir) {
        if (coveredIds.includes(s.id)) {
          ir = s;
          break;
        }
      }

      return { xray, optical, ir };
    } catch (e) {
      console.error("MocServer query failed:", e);
      return null;
    }
  }

  // 6. Generate Cutout URL
  function getCutoutUrl(surveyId, ra, dec) {
    return `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=${encodeURIComponent(surveyId)}&ra=${ra}&dec=${dec}&fov=${CUTOUT_FOV}&width=${CUTOUT_SIZE}&height=${CUTOUT_SIZE}&format=jpg`;
  }

  // 7. Setup Hover Tooltip Elements
  let popupEl, popupTitle, popupSubtitle, popupImage, popupCoords;

  function initPopup() {
    popupEl = document.createElement('div');
    popupEl.id = 'sky-popup';

    popupTitle = document.createElement('div');
    popupTitle.className = 'sky-popup-title';
    popupEl.appendChild(popupTitle);

    popupSubtitle = document.createElement('div');
    popupSubtitle.className = 'sky-popup-subtitle';
    popupEl.appendChild(popupSubtitle);

    popupImage = document.createElement('img');
    popupImage.className = 'sky-popup-image';
    popupEl.appendChild(popupImage);

    popupCoords = document.createElement('div');
    popupCoords.className = 'sky-popup-coords';
    popupEl.appendChild(popupCoords);

    document.body.appendChild(popupEl);
  }

  function showPopup(thumbnail, transientName, surveyName, surveyType, imgUrl, raText, decText) {
    if (!popupEl) initPopup();

    popupTitle.textContent = transientName;
    popupSubtitle.textContent = `${surveyType}: ${surveyName}`;
    popupImage.src = imgUrl;
    popupCoords.textContent = `RA: ${raText} | DEC: ${decText} (1.5' FOV)`;

    popupEl.classList.add('visible');
  }

  function movePopup(e) {
    if (!popupEl) return;
    let left = e.clientX + 15;
    let top = e.clientY + 15;
    const popupWidth = 324;
    const popupHeight = 360;

    // Boundary check so it stays inside the viewport using clientX/clientY
    if (left + popupWidth > window.innerWidth) {
      left = e.clientX - popupWidth - 15;
    }
    if (top + popupHeight > window.innerHeight) {
      top = e.clientY - popupHeight - 15;
    }

    popupEl.style.left = left + 'px';
    popupEl.style.top = top + 'px';
  }

  function hidePopup() {
    if (!popupEl) return;
    popupEl.classList.remove('visible');
    // Polite cleanup to avoid flash of wrong image on next show
    setTimeout(() => {
      if (!popupEl.classList.contains('visible')) {
        popupImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      }
    }, 150);
  }

  // 8. Process and Render Cell Contents
  function renderCell(cell, xraySurvey, opticalSurvey, irSurvey, raDeg, decDeg, raText, decText, transientName) {
    const container = document.createElement('div');
    container.className = 'sky-thumbnails-container';

    // (1) X-ray Thumbnail
    const xrayWrap = document.createElement('div');
    xrayWrap.className = 'sky-thumbnail-wrapper';
    if (xraySurvey) {
      const imgUrl = getCutoutUrl(xraySurvey.id, raDeg, decDeg);
      const img = document.createElement('img');
      img.className = 'sky-thumbnail';
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = `X-ray (${xraySurvey.name})`;
      img.title = `X-ray: ${xraySurvey.name}`;

      img.addEventListener('mouseover', (e) => {
        showPopup(img, transientName, xraySurvey.name, 'X-ray (0.2-10 keV)', imgUrl, raText, decText);
        movePopup(e);
      });
      img.addEventListener('mousemove', movePopup);
      img.addEventListener('mouseout', hidePopup);
      img.onerror = () => {
        const na = document.createElement('div');
        na.className = 'sky-thumbnail na xray';
        na.title = `Failed to load X-ray (${xraySurvey.name}) cutout`;
        if (img.parentNode) {
          img.parentNode.replaceChild(na, img);
        }
      };
      xrayWrap.appendChild(img);
    } else {
      const na = document.createElement('div');
      na.className = 'sky-thumbnail na xray';
      na.title = 'No X-ray coverage available';
      xrayWrap.appendChild(na);
    }
    container.appendChild(xrayWrap);

    // (2) Optical Thumbnail
    const optWrap = document.createElement('div');
    optWrap.className = 'sky-thumbnail-wrapper';
    if (opticalSurvey) {
      const imgUrl = getCutoutUrl(opticalSurvey.id, raDeg, decDeg);
      const img = document.createElement('img');
      img.className = 'sky-thumbnail';
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = `Optical (${opticalSurvey.name})`;
      img.title = `Optical: ${opticalSurvey.name}`;

      img.addEventListener('mouseover', (e) => {
        showPopup(img, transientName, opticalSurvey.name, 'Optical color view', imgUrl, raText, decText);
        movePopup(e);
      });
      img.addEventListener('mousemove', movePopup);
      img.addEventListener('mouseout', hidePopup);
      img.onerror = () => {
        const na = document.createElement('div');
        na.className = 'sky-thumbnail na optical';
        na.title = `Failed to load Optical (${opticalSurvey.name}) cutout`;
        if (img.parentNode) {
          img.parentNode.replaceChild(na, img);
        }
      };
      optWrap.appendChild(img);
    } else {
      const na = document.createElement('div');
      na.className = 'sky-thumbnail na optical';
      na.title = 'No optical coverage available';
      optWrap.appendChild(na);
    }
    container.appendChild(optWrap);

    // (3) IR Thumbnail
    const irWrap = document.createElement('div');
    irWrap.className = 'sky-thumbnail-wrapper';
    if (irSurvey) {
      const imgUrl = getCutoutUrl(irSurvey.id, raDeg, decDeg);
      const img = document.createElement('img');
      img.className = 'sky-thumbnail';
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = `IR (${irSurvey.name})`;
      img.title = `IR: ${irSurvey.name}`;

      img.addEventListener('mouseover', (e) => {
        showPopup(img, transientName, irSurvey.name, 'Infrared view', imgUrl, raText, decText);
        movePopup(e);
      });
      img.addEventListener('mousemove', movePopup);
      img.addEventListener('mouseout', hidePopup);
      img.onerror = () => {
        const na = document.createElement('div');
        na.className = 'sky-thumbnail na ir';
        na.title = `Failed to load IR (${irSurvey.name}) cutout`;
        if (img.parentNode) {
          img.parentNode.replaceChild(na, img);
        }
      };
      irWrap.appendChild(img);
    } else {
      const na = document.createElement('div');
      na.className = 'sky-thumbnail na ir';
      na.title = 'No infrared coverage available';
      irWrap.appendChild(na);
    }
    container.appendChild(irWrap);

    cell.innerHTML = '';
    cell.appendChild(container);
  }

  // 9. Main Setup Orchestration
  function init() {
    injectStyles();

    const table = document.getElementById("myTable2");
    if (!table) {
      console.warn("BlackCAT Cutouts: Table '#myTable2' not found.");
      return;
    }

    // Process Rows
    const tbodyRows = table.querySelectorAll("tbody tr");
    tbodyRows.forEach(row => {
      const tds = row.querySelectorAll("td");
      if (tds.length < 4) return;

      // Extract ID from the first column link
      const idLink = tds[0].querySelector("a");
      const idStr = idLink ? idLink.textContent.trim() : "";
      
      // Extract Name
      const nameLink = tds[1].querySelector("a");
      let transientName = nameLink ? nameLink.textContent.trim() : tds[1].textContent.trim();
      transientName = transientName.replace(/\s+/g, ' ');

      // Extract Coordinates (text format)
      const raText = tds[2].textContent.trim();
      const decText = tds[3].textContent.trim();

      const nameCell = tds[1];
      const thumbContainerWrapper = document.createElement('div');
      thumbContainerWrapper.className = 'sky-thumbnails-wrapper-cell';
      nameCell.appendChild(thumbContainerWrapper);

      // Get decimal coordinates
      const raDeg = raToDegrees(raText);
      const decDeg = decToDegrees(decText);

      if (raDeg === null || decDeg === null) {
        thumbContainerWrapper.classList.add('invalid-coord');
        return;
      }

      // Check precomputed database first
      const precomputed = PRECOMPUTED_COVERAGE[idStr];
      if (precomputed) {
        renderCell(thumbContainerWrapper, precomputed.xray, precomputed.optical, precomputed.ir, raDeg, decDeg, raText, decText, transientName);
      } else {
        // Fallback for newly added objects: query MOC Server dynamically
        thumbContainerWrapper.classList.add('loading');
        queryMocServer(raDeg, decDeg).then(result => {
          thumbContainerWrapper.classList.remove('loading');
          if (result) {
            renderCell(thumbContainerWrapper, result.xray, result.optical, result.ir, raDeg, decDeg, raText, decText, transientName);
          } else {
            // Default fallback is to use DSS2 and 2MASS if MocServer fails
            renderCell(thumbContainerWrapper, null, { id: 'CDS/P/DSS2/color', name: 'DSS2' }, { id: 'CDS/P/2MASS/color', name: '2MASS' }, raDeg, decDeg, raText, decText, transientName);
          }
        });
      }
    });
  }

  // Run on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
