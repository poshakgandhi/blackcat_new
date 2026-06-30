<?php
// Prevent caching by CDN and browser
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Function to check if the visitor is within the Southampton network ranges
function isSotonIP($ip) {
    // Local hostnames (for local testing)
    if ($ip === '127.0.0.1' || $ip === '::1') {
        return true;
    }
    
    $parts = explode('.', $ip);
    if (count($parts) === 4) {
        $firstTwo = $parts[0] . '.' . $parts[1];
        // Soton ranges: 152.78.*.* and 139.166.*.*
        if ($firstTwo === '152.78' || $firstTwo === '139.166') {
            return true;
        }
    }
    return false;
}

$user_ip = $_SERVER['REMOTE_ADDR'];

// Resolve real IP if the server is behind a reverse proxy/load balancer
if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $user_ip = trim($ips[0]);
}

if (!isSotonIP($user_ip)) {
    header('HTTP/1.1 403 Forbidden');
    echo '<h1>403 Forbidden</h1>';
    echo '<p>Access to this page is restricted to the Southampton University network only.</p>';
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BlackCAT</title>

    <!-- Bootstrap -->
    <link href="includes/bootstrap.min.css" rel="stylesheet">
    <link href="includes/style.css" rel="stylesheet">
    <link rel="stylesheet" href="includes/aladin.min.css" />
 
    <!-- you can skip the following line if your page already integrates the jQuery library -->
    <script type="text/javascript" src="includes/jquery-3.6.0.min.js" charset="utf-8"></script>    
    
    <!-- Add icon library -->
<link rel="stylesheet" href="includes/font-awesome-4.7.0/css/font-awesome.min.css">

</head>

<body>

<!-- Top Button -->
<button onclick="topFunction()" id="myBtn" class="button2" title="Go to top"><img src='media/fa-arrow-circle-up-white.png'></button> 
<script type='text/javascript' src="includes/TopButton.js" charset="utf-8"></script> 
    
<!-- Sort tables -->
<script type='text/javascript' src="includes/sortTable.js" charset="utf-8"></script> 
    
<div class="container">
   <h1>BlackCAT<small> A Catalog of Stellar-Mass Black Holes in X-ray Binaries</small></h1>

   <div class="navbar navbar-default col-md-12" role="navigation" >
      <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
        <li><a href="index.php" title="Homepage"><i class="fa fa-home"></i> Home</a></li>
        <li><a href="transients.php" title="Catalogue of Transients">Transients</a></li>
        <li><a href="references.php" title="References">References</a></li>
        <li><a href="citation.php" title="Citation, feedback and acknowledgements">Acknowledgement</a></li> 

      </div><!-- /.navbar-collapse -->
   </div><!--/.container-fluid -->
</div>


<!-- container: closes in FOOTER -->
<div class="container">

<h3>73 Black holes and growing...<br/></h3>
<h5>Select an object for more information</h5>

<div class="col-md-12" id="list" align="center">
<table class="table table-hover sortable" style="width:100%" id="myTable2">
  <thead>
     <tr>
       <th class="column-id-list"    onclick="sortTable(0)">ID    <i class="fa fa-fw fa-sort pointer"></i></th>
       <th class="column-name-list"  onclick="sortTable(1)">Name  <i class="fa fa-fw fa-sort pointer"></i><br> (Counterpart)</th>
       <th class="column-coord-list" onclick="sortTable(2)">RA    <i class="fa fa-fw fa-sort pointer"></i><br> <small>[hh:mm:ss]</small></th>
       <th class="column-coord-list" onclick="sortTable(3)">DEC   <i class="fa fa-fw fa-sort pointer"></i><br> <small>[dd:mm:ss]</small></th>
       <th class="column-gal-list"   onclick="sortTable(4)">&#8467<i class="fa fa-fw fa-sort pointer"></i><br> <small>[deg]</small></th>
       <th class="column-gal-list"   onclick="sortTable(5)">b     <i class="fa fa-fw fa-sort pointer"></i><br> <small>[deg]</small></th>
       <th class="column-mout-list"  onclick="sortTable(6)">Magnitude<i class="fa fa-fw fa-sort pointer"></i><br>Outburst (AB)</th>
       <th class="column-mqui-list"  onclick="sortTable(7)">Mag.  <i class="fa fa-fw fa-sort pointer"></i><br>Quies. (AB)</th>
       <th class="column-dist-list"  onclick="sortTable(8)">d     <i class="fa fa-fw fa-sort pointer"></i><br> <small>[kpc]</small></th>
       <th class="column-fx-list"    onclick="sortTable(9)">f<sub>x</sub><sup>peak</sup><i class="fa fa-fw fa-sort pointer"></i><br><small>[2-10] keV<br>[erg s<sup>-1</sup> cm<sup>-2</sup>]</small></th>
       <th class="column-porb-list"  onclick="sortTable(10)">Porb <i class="fa fa-fw fa-sort pointer"></i><br> <small>[h]</small></th>
     </tr>
  </thead>

  
      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=73">73</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=73">MAXI J1744-294           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:45:40.48        </td>
        <td class="column-coord-list">
           -29:00:46.10        </td>
        <td class="column-gal-list">
           266.4186500        </td>
        <td class="column-gal-list">
           -29.012806        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
           1 pc of Sgr A*        </td>
        <td class="column-fx-list">
                   </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=72">72</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=72">Swift J151857.0-572147           <br>
           </a>
        </td>
        <td class="column-coord-list">
           15:18:57.50        </td>
        <td class="column-coord-list">
           -57:21:48.70        </td>
        <td class="column-gal-list">
           321.8163989        </td>
        <td class="column-gal-list">
           -00.00332943        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
           i’>20.7        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
                   </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=71">71</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=71">Swift J1727.8-1613           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:27:43.31        </td>
        <td class="column-coord-list">
           -16:12:19.23        </td>
        <td class="column-gal-list">
           008.6416052        </td>
        <td class="column-gal-list">
           10.25479693        </td>
        <td class="column-mout-list">
           i'=12.57&plusmn;0.01        </td>
        <td class="column-mqui-list">
           i=19.41&plusmn;0.2        </td>
        <td class="column-dist-list">
           3.4&plusmn;0.3        </td>
        <td class="column-fx-list">
           1.65E-07        </td>
        <td class="column-porb-list">
           10.804&plusmn;0.001        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=70">70</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=70">MAXI J1803-298           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:03:02.79        </td>
        <td class="column-coord-list">
           -29:49:49.70        </td>
        <td class="column-gal-list">
           001.1471843        </td>
        <td class="column-gal-list">
           -03.727514        </td>
        <td class="column-mout-list">
           i'=16.01&plusmn;0.01        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           3.96E-09        </td>
        <td class="column-porb-list">
           7.0&plusmn;0.2        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=69">69</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=69">AT 2019wey           <br>
           SRGA J043520.9+552226 =  ZTF19acwrvzk = ATLAS19bcxp</a>
        </td>
        <td class="column-coord-list">
           04:35:23.27        </td>
        <td class="column-coord-list">
           +55:22:34.30        </td>
        <td class="column-gal-list">
           151.1611300        </td>
        <td class="column-gal-list">
           05.29973        </td>
        <td class="column-mout-list">
           r’=17.40&plusmn;0.05        </td>
        <td class="column-mqui-list">
           i’&ge;24.1        </td>
        <td class="column-dist-list">
           >1        </td>
        <td class="column-fx-list">
           2.40E-08        </td>
        <td class="column-porb-list">
           <8.2        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=68">68</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=68">MAXI J0637-430           <br>
           </a>
        </td>
        <td class="column-coord-list">
           06:36:23.70        </td>
        <td class="column-coord-list">
           -42:52:04.70        </td>
        <td class="column-gal-list">
           251.5320370        </td>
        <td class="column-gal-list">
           -20.67473903        </td>
        <td class="column-mout-list">
           r’=15.80&plusmn;0.01        </td>
        <td class="column-mqui-list">
           i’>20.7        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           6.29E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=67">67</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=67">MAXI J1348-630           <br>
           </a>
        </td>
        <td class="column-coord-list">
           13:48:12.79        </td>
        <td class="column-coord-list">
           -63:16:28.48        </td>
        <td class="column-gal-list">
           309.2640654        </td>
        <td class="column-gal-list">
           -01.10297116        </td>
        <td class="column-mout-list">
           i’=14.44&plusmn;0.08        </td>
        <td class="column-mqui-list">
           i’=20.3&plusmn;0.4        </td>
        <td class="column-dist-list">
           >3 / 2.2<sup>+0.5</sup><sub>-0.6</sub>        </td>
        <td class="column-fx-list">
           1.97E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=66">66</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=66">Swift J1728.9-3613           <br>
           MAXI J1728-360</a>
        </td>
        <td class="column-coord-list">
           17:28:58.64        </td>
        <td class="column-coord-list">
           -36:14:35.32        </td>
        <td class="column-gal-list">
           351.9548777        </td>
        <td class="column-gal-list">
           -00.96630145        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.35E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=65">65</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=65">MAXI J1810-222           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:12:39.66        </td>
        <td class="column-coord-list">
           -22:19:25.0        </td>
        <td class="column-gal-list">
           008.7695570        </td>
        <td class="column-gal-list">
           -01.98090632        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
           6<br>0.73&plusmn;0.03        </td>
        <td class="column-fx-list">
                   </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=64">64</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=64">MAXI J1631-479           <br>
           </a>
        </td>
        <td class="column-coord-list">
           16:31:14.22        </td>
        <td class="column-coord-list">
           -47:48:23.44        </td>
        <td class="column-gal-list">
           336.2881394        </td>
        <td class="column-gal-list">
           00.31248069        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.06E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=63">63</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=63">MAXI J1820+070           <br>
           ASASSN-18ey = V3721 Oph</a>
        </td>
        <td class="column-coord-list">
           18:20:21.94        </td>
        <td class="column-coord-list">
           +07:11:07.19        </td>
        <td class="column-gal-list">
           035.8535506        </td>
        <td class="column-gal-list">
           10.1591562        </td>
        <td class="column-mout-list">
           V&sim;14        </td>
        <td class="column-mqui-list">
           V=18.3        </td>
        <td class="column-dist-list">
           3.46<sup>+2.18</sup><sub>-1.03</sub>/<br/> 2.96&plusmn;0.33        </td>
        <td class="column-fx-list">
           2.26E-07        </td>
        <td class="column-porb-list">
           16.4518&plusmn;0.0002        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=62">62</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=62">MAXI J1813-095           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:13:34.02        </td>
        <td class="column-coord-list">
           -09:31:59.20        </td>
        <td class="column-gal-list">
           020.1116048        </td>
        <td class="column-gal-list">
           03.94826128        </td>
        <td class="column-mout-list">
           i’=18.62&plusmn;0.02        </td>
        <td class="column-mqui-list">
           i’>19.7        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           7.10E-10        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=61">61</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=61">Swift J1658.2-4242           <br>
           </a>
        </td>
        <td class="column-coord-list">
           16:58:12.70        </td>
        <td class="column-coord-list">
           -42:41:56.09        </td>
        <td class="column-gal-list">
           343.2512784        </td>
        <td class="column-gal-list">
           00.05342834        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           7.20E-10        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=60">60</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=60">MAXI J1535-571           <br>
           GRB 170902A</a>
        </td>
        <td class="column-coord-list">
           15:35:19.71        </td>
        <td class="column-coord-list">
           -57:13:47.58        </td>
        <td class="column-gal-list">
           323.7240835        </td>
        <td class="column-gal-list">
           -01.12885997        </td>
        <td class="column-mout-list">
           i’=21.8&plusmn;0.2        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.44E-07        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=59">59</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=59">IGR J17454-2919           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:45:27.68        </td>
        <td class="column-coord-list">
           -29:19:53.45        </td>
        <td class="column-gal-list">
           359.6444754        </td>
        <td class="column-gal-list">
           -00.17656165        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
           Ks=13.22&plusmn;0.02        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           2.78E-10        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=58">58</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=58">IGR J17451-3022           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:45:06.72        </td>
        <td class="column-coord-list">
           -30:22:43.30        </td>
        <td class="column-gal-list">
           358.7115137        </td>
        <td class="column-gal-list">
           -00.65799919        </td>
        <td class="column-mout-list">
           Ks=17.4&plusmn;0.2        </td>
        <td class="column-mqui-list">
           Ks=17.6&plusmn;0.1        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.90E-10        </td>
        <td class="column-porb-list">
           &sim;6.284&plusmn;0.001        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=57">57</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=57">MAXI J1828-249           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:28:58.07        </td>
        <td class="column-coord-list">
           -25:01:45.88        </td>
        <td class="column-gal-list">
           008.1151012        </td>
        <td class="column-gal-list">
           -06.5448459        </td>
        <td class="column-mout-list">
           K=17.2&plusmn;0.2        </td>
        <td class="column-mqui-list">
           Ks=20.82&plusmn;0.09        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           4.58E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=56">56</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=56">Swift J1753.7-2544           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:53:39.85        </td>
        <td class="column-coord-list">
           -25:45:14.20        </td>
        <td class="column-gal-list">
           003.6476003        </td>
        <td class="column-gal-list">
           00.10353821        </td>
        <td class="column-mout-list">
           K (not AB)&sim;16.5        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           7.09E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=55">55</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=55">Swift J174510.8-262411           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:45:10.85        </td>
        <td class="column-coord-list">
           -26:24:12.60        </td>
        <td class="column-gal-list">
           002.1108255        </td>
        <td class="column-gal-list">
           01.40326586        </td>
        <td class="column-mout-list">
           i'&sim;17.6        </td>
        <td class="column-mqui-list">
           r’>23.1&plusmn;0.5        </td>
        <td class="column-dist-list">
           <7        </td>
        <td class="column-fx-list">
           2.90E-08        </td>
        <td class="column-porb-list">
           &le;21        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=54">54</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=54">Swift J1910.2-0546           <br>
           MAXI J1910-057</a>
        </td>
        <td class="column-coord-list">
           19:10:22.80        </td>
        <td class="column-coord-list">
           -05:47:55.92        </td>
        <td class="column-gal-list">
           029.9025737        </td>
        <td class="column-gal-list">
           -06.84402939        </td>
        <td class="column-mout-list">
           i’=15.6&plusmn;0.1        </td>
        <td class="column-mqui-list">
           i’=22.18&plusmn;0.04        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.95E-08        </td>
        <td class="column-porb-list">
           >6.2        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=53">53</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=53">MAXI J1305-704           <br>
           </a>
        </td>
        <td class="column-coord-list">
           13:06:55.30        </td>
        <td class="column-coord-list">
           -70:27:05.11        </td>
        <td class="column-gal-list">
           304.2379729        </td>
        <td class="column-gal-list">
           -07.61898877        </td>
        <td class="column-mout-list">
           i’=16.61&plusmn;0.05        </td>
        <td class="column-mqui-list">
           i’=20.21&plusmn;0.08        </td>
        <td class="column-dist-list">
           7.5<sup>+1.8</sup><sub>-1.4</sub>        </td>
        <td class="column-fx-list">
           1.03E-09        </td>
        <td class="column-porb-list">
           9.5&plusmn;0.1        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=52">52</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=52">MAXI J1836-194           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:35:43.45        </td>
        <td class="column-coord-list">
           -19:19:10.48        </td>
        <td class="column-gal-list">
           013.9456207        </td>
        <td class="column-gal-list">
           -05.35432173        </td>
        <td class="column-mout-list">
           V=16.33&plusmn;0.08        </td>
        <td class="column-mqui-list">
           V>19.5        </td>
        <td class="column-dist-list">
           7&plusmn;3        </td>
        <td class="column-fx-list">
           1.01E-09        </td>
        <td class="column-porb-list">
           <4.9        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=51">51</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=51">MAXI J1543-564           <br>
           </a>
        </td>
        <td class="column-coord-list">
           15:43:17.18        </td>
        <td class="column-coord-list">
           -56:24:49.61        </td>
        <td class="column-gal-list">
           325.0848697        </td>
        <td class="column-gal-list">
           -01.12117655        </td>
        <td class="column-mout-list">
           z’&sim;20.7        </td>
        <td class="column-mqui-list">
           Ks<sub>B2</sub>=21.8&plusmn;0.2        </td>
        <td class="column-dist-list">
           >8.5        </td>
        <td class="column-fx-list">
           1.43E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=50">50</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=50">Swift J1357.2-0933           <br>
           </a>
        </td>
        <td class="column-coord-list">
           13:57:16.82        </td>
        <td class="column-coord-list">
           -09:32:38.55        </td>
        <td class="column-gal-list">
           328.7018426        </td>
        <td class="column-gal-list">
           50.00430936        </td>
        <td class="column-mout-list">
           r'=16.3&plusmn;0.05        </td>
        <td class="column-mqui-list">
           r’=21.71&plusmn;0.08        </td>
        <td class="column-dist-list">
           &ge;6 / >2.29        </td>
        <td class="column-fx-list">
           2.23E-10        </td>
        <td class="column-porb-list">
           2.8&plusmn;0.3        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=49">49</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=49">MAXI J1659-152           <br>
           V2862 Oph</a>
        </td>
        <td class="column-coord-list">
           16:59:01.68        </td>
        <td class="column-coord-list">
           -15:15:28.73        </td>
        <td class="column-gal-list">
           005.5153001        </td>
        <td class="column-gal-list">
           16.52618846        </td>
        <td class="column-mout-list">
           v=16.5        </td>
        <td class="column-mqui-list">
           r’=24.20&plusmn;0.08        </td>
        <td class="column-dist-list">
           8.6&plusmn;3.7        </td>
        <td class="column-fx-list">
           6.80E-09        </td>
        <td class="column-porb-list">
           2.414&plusmn;0.005        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=48">48</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=48">XTE J1752-223           <br>
           V5678 Sgr</a>
        </td>
        <td class="column-coord-list">
           17:52:15.09        </td>
        <td class="column-coord-list">
           -22:20:32.36        </td>
        <td class="column-gal-list">
           006.4231338        </td>
        <td class="column-gal-list">
           02.11431706        </td>
        <td class="column-mout-list">
           J=15.75&plusmn;0.01        </td>
        <td class="column-mqui-list">
           i’>24.4        </td>
        <td class="column-dist-list">
           6&plusmn;2        </td>
        <td class="column-fx-list">
           5.18E-10        </td>
        <td class="column-porb-list">
           <7        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=47">47</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=47">XTE J1652-453           <br>
           </a>
        </td>
        <td class="column-coord-list">
           16:52:20.33        </td>
        <td class="column-coord-list">
           -45:20:39.99        </td>
        <td class="column-gal-list">
           340.5296446        </td>
        <td class="column-gal-list">
           -00.78676794        </td>
        <td class="column-mout-list">
           Ks>19        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.39E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=46">46</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=46">Swift J1539.2-6227           <br>
           </a>
        </td>
        <td class="column-coord-list">
           15:39:11.96        </td>
        <td class="column-coord-list">
           -62:28:02.30        </td>
        <td class="column-gal-list">
           321.0186501        </td>
        <td class="column-gal-list">
           -05.64277055        </td>
        <td class="column-mout-list">
           uvw2=18.07&plusmn;0.03        </td>
        <td class="column-mqui-list">
           i’>19.8        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           6.47E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=45">45</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=45">Swift J1842.5-1124           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:42:17.45        </td>
        <td class="column-coord-list">
           -11:25:03.90        </td>
        <td class="column-gal-list">
           021.7270436        </td>
        <td class="column-gal-list">
           -03.17903051        </td>
        <td class="column-mout-list">
           Ks=16.75&plusmn;0.05        </td>
        <td class="column-mqui-list">
           Ks&sim;19.25        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           9.85E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=44">44</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=44">Swift J174540.2-290005           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:45:40.10        </td>
        <td class="column-coord-list">
           -29:00:06.40        </td>
        <td class="column-gal-list">
           359.9494702        </td>
        <td class="column-gal-list">
           -00.04315833        </td>
        <td class="column-mout-list">
           Ks>19.55        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           4.98E-12        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=43">43</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=43">IGR J17497-2821           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:49:38.04        </td>
        <td class="column-coord-list">
           -28:21:17.50        </td>
        <td class="column-gal-list">
           000.9531046        </td>
        <td class="column-gal-list">
           -00.45275798        </td>
        <td class="column-mout-list">
           Ks=17.8&plusmn;0.2        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.09E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=42">42</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=42">XTE J1817-330           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:17:43.53        </td>
        <td class="column-coord-list">
           -33:01:07.57        </td>
        <td class="column-gal-list">
           359.8172195        </td>
        <td class="column-gal-list">
           -07.99544288        </td>
        <td class="column-mout-list">
           g'=14.93&plusmn;0.05        </td>
        <td class="column-mqui-list">
           V>22.0        </td>
        <td class="column-dist-list">
           5.5&plusmn;4.5        </td>
        <td class="column-fx-list">
           4.94E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=41">41</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=41">XTE J1726-476           <br>
           IGR J17269-4737</a>
        </td>
        <td class="column-coord-list">
           17:26:49.28        </td>
        <td class="column-coord-list">
           -47:38:24.90        </td>
        <td class="column-gal-list">
           342.2032857        </td>
        <td class="column-gal-list">
           -06.92293655        </td>
        <td class="column-mout-list">
           Ks=18.05        </td>
        <td class="column-mqui-list">
           Ks>17.9        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           3.53E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=40">40</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=40">XTE J1818-245           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:18:24.43        </td>
        <td class="column-coord-list">
           -24:32:17.96        </td>
        <td class="column-gal-list">
           007.4426994        </td>
        <td class="column-gal-list">
           -04.19145967        </td>
        <td class="column-mout-list">
           V=17.42&plusmn;0.01        </td>
        <td class="column-mqui-list">
           R>18.4        </td>
        <td class="column-dist-list">
           3.55&plusmn;0.75        </td>
        <td class="column-fx-list">
           1.69E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=39">39</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=39">Swift J1753.5-0127           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:53:28.29        </td>
        <td class="column-coord-list">
           -01:27:06.22        </td>
        <td class="column-gal-list">
           024.8976155        </td>
        <td class="column-gal-list">
           12.18607327        </td>
        <td class="column-mout-list">
           R&sim;15.85        </td>
        <td class="column-mqui-list">
           i=21.4&plusmn;0.1        </td>
        <td class="column-dist-list">
           3.9&plusmn;0.7        </td>
        <td class="column-fx-list">
           5.64E-09        </td>
        <td class="column-porb-list">
           3.26&plusmn;0.02        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=38">38</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=38">IGR J17098-3628           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:09:45.93        </td>
        <td class="column-coord-list">
           -36:27:57.30        </td>
        <td class="column-gal-list">
           349.5539129        </td>
        <td class="column-gal-list">
           02.07451626        </td>
        <td class="column-mout-list">
           V&sim;20.8        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
           &sim;10.5        </td>
        <td class="column-fx-list">
           1.08E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=37">37</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=37">IGR J17091-3624           <br>
           SAX J1709.1-3624</a>
        </td>
        <td class="column-coord-list">
           17:09:07.61        </td>
        <td class="column-coord-list">
           -36:24:25.70        </td>
        <td class="column-gal-list">
           349.5247361        </td>
        <td class="column-gal-list">
           02.21273739        </td>
        <td class="column-mout-list">
           I=18.66&plusmn;0.03        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           5.96E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=36">36</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=36">XTE J1720-318           <br>
           V1228 Sco</a>
        </td>
        <td class="column-coord-list">
           17:19:58.99        </td>
        <td class="column-coord-list">
           -31:45:01.11        </td>
        <td class="column-gal-list">
           354.6237198        </td>
        <td class="column-gal-list">
           03.10128253        </td>
        <td class="column-mout-list">
           Ks&sim;17.15        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
           6.5&plusmn;3.5        </td>
        <td class="column-fx-list">
           1.06E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=35">35</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=35">XTE J1908+094           <br>
           </a>
        </td>
        <td class="column-coord-list">
           19:08:53.08        </td>
        <td class="column-coord-list">
           +09:23:04.84        </td>
        <td class="column-gal-list">
           043.2633756        </td>
        <td class="column-gal-list">
           00.43407857        </td>
        <td class="column-mout-list">
           I>22        </td>
        <td class="column-mqui-list">
           H&sim;20.08&plusmn;0.04        </td>
        <td class="column-dist-list">
           6.5&plusmn;3.5        </td>
        <td class="column-fx-list">
           3.77E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=34">34</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=34">SAX J1711.6-3808           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:11:37.10        </td>
        <td class="column-coord-list">
           -38:07:05.70        </td>
        <td class="column-gal-list">
           348.4406504        </td>
        <td class="column-gal-list">
           00.79880572        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
           R>22.1        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.27E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=33">33</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=33">XTE J1650-500           <br>
           </a>
        </td>
        <td class="column-coord-list">
           16:50:00.98        </td>
        <td class="column-coord-list">
           -49:57:43.60        </td>
        <td class="column-gal-list">
           336.7182648        </td>
        <td class="column-gal-list">
           -03.42701092        </td>
        <td class="column-mout-list">
           I=16.1&plusmn;0.1        </td>
        <td class="column-mqui-list">
           i’>19.4        </td>
        <td class="column-dist-list">
           2.6&plusmn;0.7        </td>
        <td class="column-fx-list">
           1.52E-08        </td>
        <td class="column-porb-list">
           7.69&plusmn;0.02        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=32">32</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=32">XTE J1118+480           <br>
           KV UMa</a>
        </td>
        <td class="column-coord-list">
           11:18:10.79        </td>
        <td class="column-coord-list">
           +48:02:12.42        </td>
        <td class="column-gal-list">
           157.6611620        </td>
        <td class="column-gal-list">
           62.32056579        </td>
        <td class="column-mout-list">
           I=13.6&plusmn;0.1        </td>
        <td class="column-mqui-list">
           i’=19.0&plusmn;0.2        </td>
        <td class="column-dist-list">
           1.72&plusmn;0.1        </td>
        <td class="column-fx-list">
           4.99E-10        </td>
        <td class="column-porb-list">
           4.0784088&plusmn;5E-07        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=31">31</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=31">XTE J1859+226           <br>
           V406 Vul</a>
        </td>
        <td class="column-coord-list">
           18:58:41.58        </td>
        <td class="column-coord-list">
           +22:39:29.40        </td>
        <td class="column-gal-list">
           054.0460820        </td>
        <td class="column-gal-list">
           08.60760698        </td>
        <td class="column-mout-list">
           R&sim;15.2        </td>
        <td class="column-mqui-list">
           R=22.54&plusmn;0.07        </td>
        <td class="column-dist-list">
           12.5&plusmn;1.5        </td>
        <td class="column-fx-list">
           3.35E-08        </td>
        <td class="column-porb-list">
           6.58&plusmn;0.05        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=30">30</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=30">SAX J1819.3-2525           <br>
           V4641 Sgr</a>
        </td>
        <td class="column-coord-list">
           18:19:21.58        </td>
        <td class="column-coord-list">
           -25:24:25.10        </td>
        <td class="column-gal-list">
           006.7740023        </td>
        <td class="column-gal-list">
           -04.78873545        </td>
        <td class="column-mout-list">
           V=8.8        </td>
        <td class="column-mqui-list">
           V=13.96&plusmn;0.02        </td>
        <td class="column-dist-list">
           6.2&plusmn;0.7        </td>
        <td class="column-fx-list">
           2.76E-07        </td>
        <td class="column-porb-list">
           67.6152&plusmn;0.0002        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=29">29</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=29">XTE J2012+381           <br>
           </a>
        </td>
        <td class="column-coord-list">
           20:12:37.71        </td>
        <td class="column-coord-list">
           +38:11:01.10        </td>
        <td class="column-gal-list">
           075.3883359        </td>
        <td class="column-gal-list">
           02.2470781        </td>
        <td class="column-mout-list">
           R=20.0&plusmn;0.2        </td>
        <td class="column-mqui-list">
           Ks=20.1&plusmn;0.2        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           7.77E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=28">28</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=28">XTE J1748-288           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:48:05.06        </td>
        <td class="column-coord-list">
           -28:28:25.80        </td>
        <td class="column-gal-list">
           000.6755628        </td>
        <td class="column-gal-list">
           -00.22203244        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
           &ge;8        </td>
        <td class="column-fx-list">
           1.61E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=27">27</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=27">XTE J1550-564           <br>
           V381 Nor</a>
        </td>
        <td class="column-coord-list">
           15:50:58.70        </td>
        <td class="column-coord-list">
           -56:28:35.20        </td>
        <td class="column-gal-list">
           325.8824005        </td>
        <td class="column-gal-list">
           -01.82687035        </td>
        <td class="column-mout-list">
           V&sim;16.6        </td>
        <td class="column-mqui-list">
           V=22.0&plusmn;0.2        </td>
        <td class="column-dist-list">
           4.5&plusmn;0.5        </td>
        <td class="column-fx-list">
           1.61E-07        </td>
        <td class="column-porb-list">
           37.0088&plusmn;0.0001        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=26">26</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=26">XTE J1755-324           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:55:28.60        </td>
        <td class="column-coord-list">
           -32:28:39.00        </td>
        <td class="column-gal-list">
           358.0392155        </td>
        <td class="column-gal-list">
           -03.63136938        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           3.41E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=25">25</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=25">GRS 1737-31           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:40:09.00        </td>
        <td class="column-coord-list">
           -31:02:24.00        </td>
        <td class="column-gal-list">
           357.5877503        </td>
        <td class="column-gal-list">
           -00.0994064        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           6.00E-10        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=24">24</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=24">GRS 1739-278           <br>
           V2606 Oph</a>
        </td>
        <td class="column-coord-list">
           17:42:40.03        </td>
        <td class="column-coord-list">
           -27:44:52.70        </td>
        <td class="column-gal-list">
           000.6720951        </td>
        <td class="column-gal-list">
           01.17572417        </td>
        <td class="column-mout-list">
           J=17.2&plusmn;0.1        </td>
        <td class="column-mqui-list">
           J>20.1        </td>
        <td class="column-dist-list">
           7.25&plusmn;1.25        </td>
        <td class="column-fx-list">
           7.20E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=23">23</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=23">XTE J1856+053           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:56:42.92        </td>
        <td class="column-coord-list">
           +05:18:34.30        </td>
        <td class="column-gal-list">
           038.2584339        </td>
        <td class="column-gal-list">
           01.24875005        </td>
        <td class="column-mout-list">
           Ks=18.28&plusmn;0.05        </td>
        <td class="column-mqui-list">
           Ks=20.1&plusmn;0.3        </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           7.46E-10        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=22">22</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=22">GRS 1730-312           <br>
           KS 1730-312</a>
        </td>
        <td class="column-coord-list">
           17:33:32.00        </td>
        <td class="column-coord-list">
           -31:12:16.00        </td>
        <td class="column-gal-list">
           356.6879350        </td>
        <td class="column-gal-list">
           01.00634388        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.14E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=21">21</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=21">GRO J1655-40           <br>
           N Sco 1994 = V1033 Sco</a>
        </td>
        <td class="column-coord-list">
           16:54:00.14        </td>
        <td class="column-coord-list">
           -39:50:44.90        </td>
        <td class="column-gal-list">
           344.9818318        </td>
        <td class="column-gal-list">
           02.45604284        </td>
        <td class="column-mout-list">
           R=13.55        </td>
        <td class="column-mqui-list">
           R=16.3&plusmn;0.1        </td>
        <td class="column-dist-list">
           3.2&plusmn;0.2        </td>
        <td class="column-fx-list">
           1.15E-07        </td>
        <td class="column-porb-list">
           62.926272&plusmn;0.000096        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=20">20</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=20">GRS 1716-249           <br>
           N Oph 1993 = V2293 Oph</a>
        </td>
        <td class="column-coord-list">
           17:19:36.93        </td>
        <td class="column-coord-list">
           -25:01:03.43        </td>
        <td class="column-gal-list">
           000.1422746        </td>
        <td class="column-gal-list">
           06.99086431        </td>
        <td class="column-mout-list">
           V&sim;16.6        </td>
        <td class="column-mqui-list">
           i’=21.39&plusmn;0.05        </td>
        <td class="column-dist-list">
           2.4&plusmn;0.4        </td>
        <td class="column-fx-list">
           1.97E-08        </td>
        <td class="column-porb-list">
           6.7&plusmn;0.2        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=19">19</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=19">GRS 1009-45           <br>
           N Vel 1993 = MM Vel</a>
        </td>
        <td class="column-coord-list">
           10:13:36.34        </td>
        <td class="column-coord-list">
           -45:04:31.50        </td>
        <td class="column-gal-list">
           275.8784710        </td>
        <td class="column-gal-list">
           09.34597492        </td>
        <td class="column-mout-list">
           R<14.7        </td>
        <td class="column-mqui-list">
           r=20.4&plusmn;0.1        </td>
        <td class="column-dist-list">
           3.8&plusmn;0.3        </td>
        <td class="column-fx-list">
           5.10E-08        </td>
        <td class="column-porb-list">
           6.8449&plusmn;0.0003        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=18">18</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=18">GRS 1915+105           <br>
           V1487 Aql</a>
        </td>
        <td class="column-coord-list">
           19:15:11.55        </td>
        <td class="column-coord-list">
           +10:56:44.80        </td>
        <td class="column-gal-list">
           045.3657052        </td>
        <td class="column-gal-list">
           -00.21897507        </td>
        <td class="column-mout-list">
           H=13.09        </td>
        <td class="column-mqui-list">
           I&sim;23.7&plusmn;0.4        </td>
        <td class="column-dist-list">
           9.4&plusmn;0.8        </td>
        <td class="column-fx-list">
           9.29E-08        </td>
        <td class="column-porb-list">
           812&plusmn;4        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=17">17</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=17">GRO J0422+32           <br>
           V518 Per</a>
        </td>
        <td class="column-coord-list">
           04:21:42.79        </td>
        <td class="column-coord-list">
           +32:54:27.10        </td>
        <td class="column-gal-list">
           165.8808146        </td>
        <td class="column-gal-list">
           -11.91243707        </td>
        <td class="column-mout-list">
           R=12.65        </td>
        <td class="column-mqui-list">
           R=21.0&plusmn;0.1        </td>
        <td class="column-dist-list">
           2.49&plusmn;0.3        </td>
        <td class="column-fx-list">
           5.77E-08        </td>
        <td class="column-porb-list">
           5.091850&plusmn;0.000005        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=16">16</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=16">GRS 1124-684           <br>
           N Mus 1991 = GU Mus</a>
        </td>
        <td class="column-coord-list">
           11:26:26.65        </td>
        <td class="column-coord-list">
           -68:40:32.83        </td>
        <td class="column-gal-list">
           295.3006588        </td>
        <td class="column-gal-list">
           -07.07263349        </td>
        <td class="column-mout-list">
           V&sim;13.5        </td>
        <td class="column-mqui-list">
           i'=19.92&plusmn;0.04        </td>
        <td class="column-dist-list">
           4.95<sup>+0.69</sup><sub>-0.65</sub>        </td>
        <td class="column-fx-list">
           1.36E-07        </td>
        <td class="column-porb-list">
           10.38252&plusmn;2E-05        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=15">15</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=15">GS 2023+338           <br>
           V404 Cyg</a>
        </td>
        <td class="column-coord-list">
           20:24:03.82        </td>
        <td class="column-coord-list">
           +33:52:01.90        </td>
        <td class="column-gal-list">
           073.1187114        </td>
        <td class="column-gal-list">
           -02.09132512        </td>
        <td class="column-mout-list">
           R&sim;10.7        </td>
        <td class="column-mqui-list">
           R=16.58&plusmn;0.01        </td>
        <td class="column-dist-list">
           2.39&plusmn;0.14        </td>
        <td class="column-fx-list">
           2.59E-07        </td>
        <td class="column-porb-list">
           155.30803&plusmn;5E-05        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=14">14</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=14">GS 1734-275           <br>
           GRO 1735-27 = KS 1732-273</a>
        </td>
        <td class="column-coord-list">
           17:36:02.00        </td>
        <td class="column-coord-list">
           -27:25:41.00        </td>
        <td class="column-gal-list">
           000.1608028        </td>
        <td class="column-gal-list">
           02.59055981        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.20E-09        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=13">13</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=13">GS 2000+251           <br>
           QZ Vul</a>
        </td>
        <td class="column-coord-list">
           20:02:49.48        </td>
        <td class="column-coord-list">
           +25:14:11.36        </td>
        <td class="column-gal-list">
           063.3663891        </td>
        <td class="column-gal-list">
           -02.99847575        </td>
        <td class="column-mout-list">
           V=16.4        </td>
        <td class="column-mqui-list">
           R=21.3&plusmn;0.2        </td>
        <td class="column-dist-list">
           2.7&plusmn;0.7        </td>
        <td class="column-fx-list">
           3.46E-07        </td>
        <td class="column-porb-list">
           8.258095&plusmn;0.000005        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=12">12</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=12">GS 1354-64           <br>
           BW Cir</a>
        </td>
        <td class="column-coord-list">
           13:58:09.70        </td>
        <td class="column-coord-list">
           -64:44:05.80        </td>
        <td class="column-gal-list">
           309.9774112        </td>
        <td class="column-gal-list">
           -02.77987343        </td>
        <td class="column-mout-list">
           V=16.9        </td>
        <td class="column-mqui-list">
           i'&sim;20.2        </td>
        <td class="column-dist-list">
           &sim;25        </td>
        <td class="column-fx-list">
           2.38E-09        </td>
        <td class="column-porb-list">
           61.068&plusmn;0.002        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=11">11</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=11">EXO 1846-031           <br>
           </a>
        </td>
        <td class="column-coord-list">
           18:49:17.05        </td>
        <td class="column-coord-list">
           -03:03:55.26        </td>
        <td class="column-gal-list">
           029.9580344        </td>
        <td class="column-gal-list">
           -00.91793414        </td>
        <td class="column-mout-list">
           r>23        </td>
        <td class="column-mqui-list">
           I>22.3        </td>
        <td class="column-dist-list">
           &sim;7        </td>
        <td class="column-fx-list">
           1.02E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=10">10</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=10">SLX 1746-331           <br>
           </a>
        </td>
        <td class="column-coord-list">
           17:49:48.96        </td>
        <td class="column-coord-list">
           -33:12:17.10        </td>
        <td class="column-gal-list">
           356.8092322        </td>
        <td class="column-gal-list">
           -02.97358081        </td>
        <td class="column-mout-list">
           Ks=18.78&plusmn;0.06        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.37E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=9">9</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=9">H 1705-250           <br>
           N Oph 1977 = V2107 Oph</a>
        </td>
        <td class="column-coord-list">
           17:08:14.52        </td>
        <td class="column-coord-list">
           -25:05:30.15        </td>
        <td class="column-gal-list">
           358.5892354        </td>
        <td class="column-gal-list">
           09.05387073        </td>
        <td class="column-mout-list">
           B=16.3&plusmn;0.5        </td>
        <td class="column-mqui-list">
           R&sim;20.9&plusmn;0.2        </td>
        <td class="column-dist-list">
           8.6&plusmn;2.1        </td>
        <td class="column-fx-list">
           1.75E-08        </td>
        <td class="column-porb-list">
           12.51&plusmn;0.03        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=8">8</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=8">H 1743-322           <br>
           XTE J1746-322 = IGR J17464-3213</a>
        </td>
        <td class="column-coord-list">
           17:46:15.60        </td>
        <td class="column-coord-list">
           -32:14:00.86        </td>
        <td class="column-gal-list">
           357.2550371        </td>
        <td class="column-gal-list">
           -01.83291737        </td>
        <td class="column-mout-list">
           I=19.6        </td>
        <td class="column-mqui-list">
           i'>24        </td>
        <td class="column-dist-list">
           &sim;10        </td>
        <td class="column-fx-list">
           4.62E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=7">7</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=7">3A 0620-003           <br>
           N Mon 1975 = V616 Mon</a>
        </td>
        <td class="column-coord-list">
           06:22:44.50        </td>
        <td class="column-coord-list">
           -00:20:44.72        </td>
        <td class="column-gal-list">
           209.9563081        </td>
        <td class="column-gal-list">
           -06.53987555        </td>
        <td class="column-mout-list">
           V&sim;11.1        </td>
        <td class="column-mqui-list">
           V=18.23&plusmn;0.04        </td>
        <td class="column-dist-list">
           1.06&plusmn;0.1        </td>
        <td class="column-fx-list">
           2.65E-06        </td>
        <td class="column-porb-list">
           7.752340&plusmn;2E-06        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=6">6</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=6">3A 1524-617           <br>
           KY TrA</a>
        </td>
        <td class="column-coord-list">
           15:28:16.93        </td>
        <td class="column-coord-list">
           -61:52:57.95        </td>
        <td class="column-gal-list">
           320.3188498        </td>
        <td class="column-gal-list">
           -04.4268531        </td>
        <td class="column-mout-list">
           B=17.3        </td>
        <td class="column-mqui-list">
           I=21.61&plusmn;0.09        </td>
        <td class="column-dist-list">
           8.0&plusmn;0.9        </td>
        <td class="column-fx-list">
           4.66E-08        </td>
        <td class="column-porb-list">
           6.2&plusmn;0.2        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=5">5</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=5">1H 1659-487           <br>
           GX 339-4 = V821 Ara</a>
        </td>
        <td class="column-coord-list">
           17:02:49.40        </td>
        <td class="column-coord-list">
           -48:47:23.40        </td>
        <td class="column-gal-list">
           338.9390902        </td>
        <td class="column-gal-list">
           -04.32648295        </td>
        <td class="column-mout-list">
           I=13.6&plusmn;0.1        </td>
        <td class="column-mqui-list">
           r=19.9&plusmn;0.1        </td>
        <td class="column-dist-list">
           >5        </td>
        <td class="column-fx-list">
           2.56E-08        </td>
        <td class="column-porb-list">
           42.21&plusmn;0.01        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=4">4</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=4">4U 1755-338           <br>
           V4134 Sgr</a>
        </td>
        <td class="column-coord-list">
           17:58:40.04        </td>
        <td class="column-coord-list">
           -33:48:26.80        </td>
        <td class="column-gal-list">
           357.2155210        </td>
        <td class="column-gal-list">
           -04.87236175        </td>
        <td class="column-mout-list">
           V&sim;18.5        </td>
        <td class="column-mqui-list">
           V>21.96        </td>
        <td class="column-dist-list">
           6.5&plusmn;2.5        </td>
        <td class="column-fx-list">
           1.17E-09        </td>
        <td class="column-porb-list">
           &sim;4.4        </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:bold>
        <td class="column-id-list">
           <a href="info.php?id=3">3</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=3">4U 1543-475           <br>
           IL Lup</a>
        </td>
        <td class="column-coord-list">
           15:47:08.32        </td>
        <td class="column-coord-list">
           -47:40:10.80        </td>
        <td class="column-gal-list">
           330.9178710        </td>
        <td class="column-gal-list">
           05.42614694        </td>
        <td class="column-mout-list">
           V=13.90        </td>
        <td class="column-mqui-list">
           V=16.7        </td>
        <td class="column-dist-list">
           7.5&plusmn;0.5        </td>
        <td class="column-fx-list">
           9.42E-08        </td>
        <td class="column-porb-list">
           26.79377&plusmn;0.00007        </td>
      </tr>
  </tbody>

    </strong>  
      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=2">2</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=2">4U 1630-472           <br>
           Nor X-1</a>
        </td>
        <td class="column-coord-list">
           16:34:01.61        </td>
        <td class="column-coord-list">
           -47:23:34.80        </td>
        <td class="column-gal-list">
           336.9112429        </td>
        <td class="column-gal-list">
           00.25029536        </td>
        <td class="column-mout-list">
           K (not AB)=16.1        </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
           4.7-11.5        </td>
        <td class="column-fx-list">
           2.65E-08        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

      
  
  <tbody>
     <tr style=font-weight:normal>
        <td class="column-id-list">
           <a href="info.php?id=1">1</a>
        </td>
        <td class="column-name-list">
           <a href="info.php?id=1">Cen X-2           <br>
           </a>
        </td>
        <td class="column-coord-list">
           14:00:28.20        </td>
        <td class="column-coord-list">
           -64:47:35.60        </td>
        <td class="column-gal-list">
           310.2000982        </td>
        <td class="column-gal-list">
           -02.9001343        </td>
        <td class="column-mout-list">
                   </td>
        <td class="column-mqui-list">
                   </td>
        <td class="column-dist-list">
                   </td>
        <td class="column-fx-list">
           1.58E-07        </td>
        <td class="column-porb-list">
                   </td>
      </tr>
  </tbody>

      
          

</table>
</div>

<h5>
   Please <a href='citation.php'>acknowledge</a> the use of this catalogue in any published work you derive from it.</h5>

<hr>
<small>
<div style='text-align:right' class="col-md-12"> 
   Last modified: 22 September 2025.</div> <!-- col-md-12 -->
</small>


<div id="footer" class="col-md-12">
  <div class="col-md-7" id="footer-txt">
    <p class="muted credit">&copy; 2014-2026 Jesús M. Corral-Santana
    <br>
    <small>BlackCAT acknowledges financial support to <a href='http://www.anid.cl/'   title='ANID' target="_blank">ANID (CONICYT)</a> through the <a href='http://www.conicyt.cl/fondecyt/' title='FONDECYT' target="_blank">FONDECYT</a> project No. 3140310.</small>
    </p>
  </div> <!-- col-md-7 -->

  <div class="col-md-2" align="left">
     <a href="https://www.anid.cl/" target="_blank"><img alt="ANID" src="media/logo_anid.png" width="40px" height="40px" ></a> 
     <a href="https://www.conicyt.cl/fondecyt/" target="_blank"><img alt="FONDECYT" src="media/logo_fondecyt2.png" width="80" height="45" ></a>
  </div> <!-- col-md-2 -->

  <div class="col-md-3" align="right">
  <small>Mirrors:</small>
     <a href="https://astro.puc.cl/BlackCAT" target="_blank"><img src="media/logo_puc2.png" width="45px" height="45px" alt="PUC" ></a>
     <a href="https://research.iac.es/proyecto/compactos/BlackCAT/" target="_blank"><img src="media/logo_iac.png" width="45px" height="45px" alt="IAC" ></a>
     <a href="https://www.sc.eso.org/~jcorral/BlackCAT" target="_blank"><img src="media/logo_eso.jpg" width="35px" alt="ESO" ></a>
  </div> <!-- col-md-3 -->
  <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="includes/jquery.min.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="includes/bootstrap.min.js"></script>
  <!-- Aladin Lite Cutouts Extension -->
  <script src="includes/cutouts.js"></script>
  
</div> <!-- col-md-12 -->


</div> <!-- closes container from HEADER -->
</body>
</html>
