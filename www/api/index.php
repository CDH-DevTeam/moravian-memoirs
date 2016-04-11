<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require 'vendor/autoload.php';

session_start();

use \Slim\Middleware\HttpBasicAuthentication\AuthenticatorInterface;
class DBAuthenticator implements AuthenticatorInterface {
    public function __invoke(array $arguments) {
    	$db = getConnection();
    	$passHash = hash('sha256', $arguments['password']);
    	$res = $db->query("SELECT id, user, password FROM users WHERE user = '".$arguments['user']."' AND password = '".$passHash."'");

    	if ($res->num_rows > 0) {
    		$row = $res->fetch_assoc();

    		if ($row['password'] == $passHash) {
    			$_SESSION['user'] = $row['user'];
    			return true;
    		}
    		else {
    			return false;
    		}
    	}
    	else {
    		return false;
    	}
    }
}

$app = new \Slim\Slim();

$app->add(new \Slim\Middleware\HttpBasicAuthentication([
	"path" => '/admin',
	"secure" => false,
	"authenticator" => new DBAuthenticator()
]));

$app->get('/', 'frontPage');

$app->get('/person/:id', 'getPerson');

$app->get('/persons/duplicates/:num1/:num2', 'getDuplicatePersons');
$app->get('/persons/place/:place', 'getPersonsByPlace');
$app->get('/persons/birthplace/:place', 'getPersonsByBirthPlace');
$app->get('/persons/deathplace/:place', 'getPersonsByDeathPlace');
$app->get('/persons/year_range/:num1/:num2', 'getPersonsByYears');
$app->get('/persons/age/:age/:buffer', 'getPersonsByAge');
$app->get('/persons/search/:query', 'searchPersons');
$app->get('/persons/:num1/:num2(/:order(/:dir))', 'getPersons');

$app->get('/locations/year_range/:num1/:num2', 'getLocationsByYears');
$app->get('/locations/age/:age/:buffer', 'getLocationsByAge');
$app->get('/locations/population', 'getLocationsPopulations');
$app->get('/locations/movements(/:num1/:num2)', 'getMovementLocations');
$app->get('/locations', 'getLocations');

$app->get('/place/:id', 'getPlace');

$app->get('/places/duplicates/:num1/:num2', 'getDuplicatePlaces');
$app->get('/places/search/:query', 'searchPlaces');
$app->get('/places/:num1/:num2(/:order(/:dir))', 'getPlaces');

$app->get('/areas/:num1/:num2', 'getAreas');



// API v2
$app->get('/v2/locations/movements/:num1/:num2(/)(range_type/:rangetype/?)(/)(gender/:gender/?)', 'getMovementLocationsV2');
$app->get('/v2/locations(/)(year_range/:num1/:num2/?)(/)(range_type/:rangetype/?)(/)(relation/:relation/?)(/)(gender/:gender/?)(/)(name/:name/?)', 'getLocationsV2');
$app->get('/v2/persons(/)(year_range/:num1/:num2/?)(/)(range_type/:rangetype/?)(/)(gender/:gender/?)(/)(name/:name/?)(/)(page/:page/?)', 'getPersonsV2');
//$app->get('/v2/persons(/)(place/:place/?)(/)(relation/:relation/?)(/)(year_range/:num1/:num2/?)(/)(range_type/:rangetype/?)(/)(gender/:gender/?)(/)(name/:name/?)', 'getPersonsV2');



// Admin
$app->put('/admin/person/:id', 'putPerson');
$app->put('/admin/place/:id', 'putPlace');

$app->post('/admin/places/combine/:id', 'combinePlaces');
$app->post('/admin/persons/combine/:id', 'combinePersons');



$app->contentType('application/json;charset=utf-8');
$app->response()->header('Access-Control-Allow-Origin', '*');
$app->run();

function getConnection() {
	include 'config.php';

	$db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	$db->set_charset('utf8');

	return $db;
}

function processItem(&$item, $key) {
	if (is_null($item)) {
		unset($item);
	}
	else if (is_string($item)) {
		$item = mb_encode_numericentity($item, array (0x80, 0xffff, 0, 0xffff), 'UTF-8');
	}
}

function array_unset_recursive(&$array, $remove) {
    if (!is_array($remove)) $remove = array($remove);
    foreach ($array as $key => &$value) {
        if (in_array($value, $remove)) unset($array[$key]);
        else if (is_array($value)) {
            array_unset_recursive($value, $remove);
        }
    }
}

function json_encode_is($arr, $metadata = null) {
	$output = array();

	if (!is_null($metadata)) {
		$output['metadata'] = $metadata;
	}

	$output['data']= $arr;
	$output['login_info'] = array(
		'user' => isset($_SESSION['user']) ? $_SESSION['user'] : 'null'
	);

	array_walk_recursive($output, 'processItem');
	array_unset_recursive($output, null);
	return mb_decode_numericentity(json_encode($output), array (0x80, 0xffff, 0, 0xffff), 'UTF-8');
}

function frontPage() {
	global $app;
	$app->contentType('text/html;charset=utf-8');
	readfile('front.html');
}

function getPersons($num1 = null, $num2 = null, $order = null, $orderdir = null) {
	$sql = "SELECT SQL_CALC_FOUND_ROWS persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id".
		(
			!is_null($order) ? " ORDER BY ".$order.(!is_null($orderdir) ? ' '.$orderdir : ' ASC') : ''
		).
		(
			!is_null($num1) && is_null($num2) ? " LIMIT 0, ".$num1 :
			!is_null($num1) && !is_null($num2) ? " LIMIT ".$num1.", ".$num2 :
			''
		);

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();

	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}

	$res = $db->query('SELECT FOUND_ROWS() total');
	$row = $res->fetch_assoc();

	echo json_encode_is($data, array(
		'page' => $num1,
		'total' => $row['total']
	));
}

function searchPersons($query, $order = null, $orderdir = null) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id ".
		" WHERE LOWER(persons.surname) LIKE '%".strtolower($query)."%' OR LOWER(persons.surname_literal) LIKE '%".strtolower($query)."%' OR LOWER(persons.firstname) LIKE '%".strtolower($query)."%' OR LOWER(persons.ll_id) LIKE '%".strtolower($query)."%'".
		(
			!is_null($order) ? " ORDER BY persons.".$order.(!is_null($orderdir) ? ' '.$orderdir : ' ASC') : ''
		);

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}
	echo json_encode_is($data);
}

function getPersonsByPlace($place) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id WHERE persons.birthplace = ".$place." OR persons.deathplace = ".$place;

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}
	echo json_encode_is($data);
}

function getPersonsByBirthPlace($place) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id WHERE persons.birthplace = ".$place;

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}
	echo json_encode_is($data);
}

function getPersonsByDeathPlace($place) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id WHERE persons.deathplace = ".$place;

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}
	echo json_encode_is($data);
}

function getPersonsByYears($num1, $num2) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id WHERE persons.death_year >= ".$num1." AND persons.death_year < ".$num2." AND persons.birth_year < persons.death_year";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}
	echo json_encode_is($data);
}

function getPersonsByAge($age, $buffer) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id WHERE (persons.death_year-persons.birth_year)-".$buffer." < ".$age." AND (persons.death_year-persons.birth_year)+".$buffer." > ".$age." AND persons.birth_year < persons.death_year";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, personObj($row));
	}
	echo json_encode_is($data);
}

function getPerson($id) {
	$sql = "SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons INNER JOIN places b_p ON persons.birthplace = b_p.id INNER JOIN places d_p ON persons.deathplace = d_p.id WHERE persons.id = ".$id;

	$db = getConnection();

	$res = $db->query($sql);
	
	$row = $res->fetch_assoc();

	if ($row['gender'] == 0) {
		$gender = 'male';
	}
	else if ($row['gender'] == 1) {
		$gender = 'female';
	}
	else {
		$gender = '';
	}

	$data = array(
		'id' => $row['id'], 
		'surname' => $row['surname'],
		'surname_literal' => $row['surname_literal'],
		'firstname' => $row['firstname'],
		'gender' => $gender,
		'familystatus' => $row['familystatus'],
		'birth' => array(
			'day' => $row['birth_day'],
			'month' => $row['birth_month'],
			'year' => $row['birth_year'],
			'place' => array(
				'id' => $row['birthplace'],
				'name' => $row['birthplacename'],
				'lat' => $row['birthplacelat'],
				'lng' => $row['birthplacelng']
			)
		),
		'death' => array(
			'day' => $row['death_day'],
			'month' => $row['death_month'],
			'year' => $row['death_year'],
			'place' => array(
				'id' => $row['deathplace'],
				'name' => $row['deathplacename'],
				'lat' => $row['deathplacelat'],
				'lng' => $row['deathplacelng']
			)
		),
		'documents' => array()
	);

	$docSql = 'SELECT documents.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM documents INNER JOIN places b_p ON documents.birthplace = b_p.id INNER JOIN places d_p ON documents.deathplace = d_p.id INNER JOIN persondocuments ON persondocuments.document = documents.id WHERE persondocuments.person = '.$row['id'];

	$docRes = $db->query($docSql);

	while ($docRow = $docRes->fetch_assoc()) {
		array_push($data['documents'], array(
			'id' => $docRow['id'],
			'll_id' => $docRow['ll_id'],
			'll_idnum' => $docRow['ll_idnum'],
			'surname' => $docRow['surname'],
			'surname_literal' => $docRow['surname_literal'],
			'firstname' => $docRow['firstname'],
			'gender' => $gender,
			'familystatus' => $docRow['familystatus'],
			'reference' => $docRow['reference'],
			'birth' => array(
				'day' => $docRow['birth_day'],
				'month' => $docRow['birth_month'],
				'year' => $docRow['birth_year'],
				'll_place' => $docRow['ll_birthplace'],
				'place' => array(
					'id' => $docRow['birthplace'],
					'name' => $docRow['birthplacename'],
					'lat' => $docRow['birthplacelat'],
					'lng' => $docRow['birthplacelng']
				)
			),
			'death' => array(
				'day' => $docRow['death_day'],
				'month' => $docRow['death_month'],
				'year' => $docRow['death_year'],
				'll_place' => $docRow['ll_deathplace'],
				'place' => array(
					'id' => $docRow['deathplace'],
					'name' => $docRow['deathplacename'],
					'lat' => $docRow['deathplacelat'],
					'lng' => $docRow['deathplacelng']
				)
			)
		));
	}

	echo json_encode_is($data);
}

function personObj($row) {
	return array(
		'id' => $row['id'], 
		'll_id' => $row['ll_id'],
		'll_idnum' => $row['ll_idnum'],
		'surname' => $row['surname'],
		'surname_literal' => $row['surname_literal'],
		'firstname' => $row['firstname'],
		'birth' => array(
			'day' => $row['birth_day'],
			'month' => $row['birth_month'],
			'year' => $row['birth_year'],
			'place' => array(
				'id' => $row['birthplace'],
				'name' => $row['birthplacename'],
				'lat' => $row['birthplacelat'],
				'lng' => $row['birthplacelng']
			)
		),
		'death' => array(
			'day' => $row['death_day'],
			'month' => $row['death_month'],
			'year' => $row['death_year'],
			'place' => array(
				'id' => $row['deathplace'],
				'name' => $row['deathplacename'],
				'lat' => $row['deathplacelat'],
				'lng' => $row['deathplacelng']
			)
		)
	);
}

function placeObj($row) {
	return array(
		'id' => $row['id'], 
		'name' => $row['name'],
		'name_en' => $row['name_en'],
		'area' => $row['area'],
		'area_en' => $row['area_en'],
		'google_id' => $row['google_id'],
		'google_name' => $row['google_name'],
		'google_location_type' => $row['google_location_type'],
		'lat' => $row['lat'],
		'lng' => $row['lng']
	);
}

function locationObj($row) {
	$ret = array(
		'id' => $row['id'], 
		'name' => $row['name'],
		'area' => $row['area'],
		'lat' => $row['lat'],
		'lng' => $row['lng']
	);
	if (isset($row['c'])) {
		$ret['c'] = $row['c'];
	}

	return $ret;
}

function getLocations() {
	$sql = "SELECT DISTINCT * FROM places WHERE lat IS NOT NULL AND lng IS NOT NULL";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, locationObj($row));
	}
	echo json_encode_is($data);
}

function getLocationsPopulations() {
	$sql = "SELECT places.*, Count(persons.id) AS c FROM persons INNER JOIN places ON persons.birthplace = places.id OR persons.deathplace = places.id WHERE lat IS NOT NULL AND lng IS NOT NULL GROUP BY places.id ORDER BY c DESC";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, array(
		'id' => $row['id'], 
		'name' => $row['name'],
		'area' => $row['area'],
		'lat' => $row['lat'],
		'lng' => $row['lng'],
		'persons' => $row['c']
	));
	}
	echo json_encode_is($data);
}

function getMovementLocations($num1 = null, $num2 = null) {
	$condition = "";
	if (!is_null($num1) && !is_null($num2)) {
		$condition = " AND persons.death_year >= ".$num1." AND persons.death_year <= ".$num2." AND persons.birth_year < persons.death_year";
	}

	$sql = "SELECT DISTINCT p1.id birthplace_id, p1.name birthplace_name, p1.area birthplace_area, p1.lat birthplace_lat, p1.lng birthplace_lng, p2.id deathplace_id, p2.name deathplace_name, p2.area deathplace_area, p2.lat deathplace_lat, p2.lng deathplace_lng FROM persons INNER JOIN places p1 ON persons.birthplace = p1.id INNER JOIN places p2 ON persons.deathplace = p2.id WHERE p1.id <> p2.id AND p1.lat IS NOT NULL AND p1.lng IS NOT NULL and p2.lat IS NOT NULL and p2.lng IS NOT NULL".$condition." ORDER BY p1.id";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, array(
			'birthplace' => array(
				'id' => $row['birthplace_id'], 
				'name' => $row['birthplace_name'],
				'area' => $row['birthplace_area'],
				'lat' => $row['birthplace_lat'],
				'lng' => $row['birthplace_lng']
			),
			'deathplace' => array(
				'id' => $row['deathplace_id'], 
				'name' => $row['deathplace_name'],
				'area' => $row['deathplace_area'],
				'lat' => $row['deathplace_lat'],
				'lng' => $row['deathplace_lng']
			)
		));
	}
	echo json_encode_is($data);
}

function getLocationsByYears($num1, $num2) {
//	$sql = "SELECT places.*, Count(persons.id) AS c FROM persons INNER JOIN places ON persons.birthplace = places.id OR persons.deathplace = places.id WHERE lat IS NOT NULL AND lng IS NOT NULL GROUP BY places.id ORDER BY c DESC";
	$sql = "SELECT DISTINCT places.id, places.name, places.area, places.lat, places.lng, Count(persons.id) AS c FROM places INNER JOIN places ON persons.birthplace = places.id OR persons.deathplace = places.id WHERE places.lat IS NOT NULL AND places.lng IS NOT NULL AND persons.death_year >= ".$num1." AND persons.death_year <= ".$num2." AND persons.birth_year < persons.death_year GROUP BY places.id ORDER BY c DESC";
	echo $sql;
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, locationObj($row));
	}
	echo json_encode_is($data);
}

function getLocationsByAge($age, $buffer) {
	$sql = "SELECT places.id, places.name, places.area, places.lat, places.lng FROM places INNER JOIN persons ON places.id = persons.birthplace OR places.id = persons.deathplace WHERE places.lat IS NOT NULL AND places.lng IS NOT NULL AND (persons.death_year-persons.birth_year)-".$buffer." < ".$age." AND (persons.death_year-persons.birth_year)+".$buffer." > ".$age." AND persons.birth_year < persons.death_year";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, locationObj($row));
	}
	echo json_encode_is($data);
}

function getPlaces($num1 = null, $num2 = null, $order = null, $orderdir = null) {
	$sql = "SELECT SQL_CALC_FOUND_ROWS * FROM places".

		(
			!is_null($order) ? " ORDER BY ".$order.(!is_null($orderdir) ? ' '.$orderdir : ' ASC') : ''
		).
		(
			!is_null($num1) && is_null($num2) ? " LIMIT 0, ".$num1 :
			!is_null($num1) && !is_null($num2) ? " LIMIT ".$num1.", ".$num2 :
			''
		);

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, placeObj($row));
	}

	$res = $db->query('SELECT FOUND_ROWS() total');
	$row = $res->fetch_assoc();

	echo json_encode_is($data, array(
		'page' => $num1,
		'total' => $row['total']
	));
}

function getAreas($num1 = null, $num2 = null) {
	$sql = "SELECT DISTINCT area, area_en FROM places WHERE area != '' AND area_en != '' ORDER BY area".
		(
			!is_null($num1) && is_null($num2) ? " LIMIT 0, ".$num1 :
			!is_null($num1) && !is_null($num2) ? " LIMIT ".$num1.", ".$num2 :
			''
		);

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, array(
			'area' => $row['area'],
			'area_en' => $row['area_en']
		));
	}
	echo json_encode_is($data);
}

function getDuplicatePlaces($num1 = null, $num2 = null) {
	$sql = "SELECT SQL_CALC_FOUND_ROWS google_id, google_name, lat, lng, COUNT(*) c FROM places WHERE google_id != '' GROUP BY google_id HAVING c > 1 ORDER BY c DESC".
		(
			!is_null($num1) && is_null($num2) ? " LIMIT 0, ".$num1 :
			!is_null($num1) && !is_null($num2) ? " LIMIT ".$num1.", ".$num2 :
			''
		);

	$db = getConnection();

    $sqlModesRes = $db->query('SELECT @@sql_mode');
    $sqlModes = $sqlModesRes->fetch_assoc();

    $sqlModesArray = explode(',', $sqlModes['@@sql_mode']);
    $sqlModesArray = array_diff($sqlModesArray, array('ONLY_FULL_GROUP_BY'));

    $db->query("SET sql_mode = '".implode(',', $sqlModesArray)."'");

	$res = $db->query($sql);
	
	$rowCountRes = $db->query('SELECT FOUND_ROWS() total');
	$rowCount = $rowCountRes->fetch_assoc();
	$data = array();
	while ($row = $res->fetch_assoc()) {
		$places = array();

		$placesRes = $db->query('SELECT * FROM places WHERE google_id = "'.$row['google_id'].'"');

		while ($placesRow = $placesRes->fetch_assoc()) {
			array_push($places, placeObj($placesRow));
		}

		array_push($data, array(
			'google_id' => $row['google_id'],
			'google_name' => $row['google_name'],
			'lat' => $row['lat'],
			'lng' => $row['lng'],
			'count' => $row['c'],
			'places' => $places
		));
	}

	echo json_encode_is($data, array(
		'page' => $num1,
		'total' => $rowCount['total']
	));
}

function getDuplicatePersons($num1 = null, $num2 = null) {
	$sql = "SELECT SQL_CALC_FOUND_ROWS surname_literal, firstname, birth_year, death_year, birthplace, deathplace, count(*) c FROM persons GROUP BY surname_literal, firstname, birth_year, death_year, birthplace, deathplace HAVING c > 1 ORDER BY c DESC".
		(
			!is_null($num1) && is_null($num2) ? " LIMIT 0, ".$num1 :
			!is_null($num1) && !is_null($num2) ? " LIMIT ".$num1.", ".$num2 :
			''
		);

	$db = getConnection();

	$res = $db->query($sql);
	
	$rowCountRes = $db->query('SELECT FOUND_ROWS() total');
	$rowCount = $rowCountRes->fetch_assoc();

	$data = array();
	while ($row = $res->fetch_assoc()) {
		$persons = array();

		$personsSql = 'SELECT persons.*, b_p.name birthplacename, b_p.area birthplacearea, b_p.lat birthplacelat, b_p.lng birthplacelng, d_p.name deathplacename, d_p.area deathplacearea, d_p.lat deathplacelat, d_p.lng deathplacelng FROM persons '.
			'INNER JOIN places b_p ON persons.birthplace = b_p.id '.
			'INNER JOIN places d_p ON persons.deathplace = d_p.id '.
			'WHERE persons.surname_literal = "'.$row['surname_literal'].'" '.
			'AND persons.firstname = "'.(is_null($row['firstname']) ? 'null' : $row['firstname']).'" '.
			'AND persons.birth_year = '.(is_null($row['birth_year']) ? 'null' : $row['birth_year']).' '.
			'AND persons.death_year = '.(is_null($row['death_year']) ? 'null' : $row['death_year']).' '.
			'AND persons.birthplace = '.(is_null($row['birthplace']) ? 'null' : $row['birthplace']).' '.
			'AND persons.deathplace = '.(is_null($row['deathplace']) ? 'null' : $row['deathplace']);
		$personsRes = $db->query($personsSql);

		while ($personsRow = $personsRes->fetch_assoc()) {
			array_push($persons, personObj($personsRow));
		}

		array_push($data, array(
			'surname_literal' => $row['surname_literal'],
			'firstname' => $row['firstname'],
			'birth_year' => $row['birth_year'],
			'death_year' => $row['death_year'],
			'birthplace' => $row['birthplace'],
			'deathplace' => $row['deathplace'],
			'count' => $row['c'],
			'persons' => $persons
		));
	}
	echo json_encode_is($data, array(
		'page' => $num1,
		'total' => $rowCount['total']
	));
}

function searchPlaces($query, $order = null, $orderdir = null) {
	$sql = "SELECT * FROM places WHERE LOWER(name) LIKE '%".strtolower($query)."%' OR LOWER(name_en) LIKE '%".strtolower($query)."%' OR LOWER(google_id) LIKE '%".strtolower($query)."%' OR LOWER(area) LIKE '%".strtolower($query)."%' OR LOWER(area_en) LIKE '%".strtolower($query)."%' OR LOWER(name_ll) LIKE '%".strtolower($query)."%' OR LOWER(area_ll) LIKE '%".strtolower($query)."%'".
		(
			!is_null($order) ? " ORDER BY ".$order.(!is_null($orderdir) ? ' '.$orderdir : ' ASC') : ' ORDER BY name'
		);

	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, placeObj($row));
	}
	echo json_encode_is($data);
}

function getPlace($id) {
	$sql = "SELECT * FROM places WHERE id = ".$id;

	$db = getConnection();

	$res = $db->query($sql);
	
	$row = $res->fetch_assoc();

	if (@unserialize($row['google_address_data'])) {
		$googleAddressData = unserialize($row['google_address_data']);
	}
	else if (@json_decode($row['google_address_data'])) {
		$googleAddressData = json_decode($row['google_address_data']);
	}
	else {
		$googleAddressData = null;
	}

	$data = array(
		'id' => $row['id'], 
		'name' => $row['name'],
		'name_en' => $row['name_en'],
		'name_ll' => $row['name_ll'],
		'area' => $row['area'],
		'area_en' => $row['area_en'],
		'area_ll' => $row['area_ll'],
		'google_id' => $row['google_id'],
		'google_name' => $row['google_name'],
		'google_location_type' => $row['google_location_type'],
		'google_address' => $googleAddressData,
		'commentary' => $row['commentary'],
		'lat' => $row['lat'],
		'lng' => $row['lng']
	);

	echo json_encode_is($data);
}

function formatDate($day, $month, $year) {
	return $year > 0 ?
		$year.($month > 0 ? '-'.$month.($day > 0 ? '-'.$day : ''
			)
		: '') 
	: null;
}

function getGender($gender) {
	if (is_null($gender)) {
		return null;
	}
	else if ($gender == 0) {
		return 'M';
	}
	else if ($gender == 1) {
		return 'F';
	}
}

function putPerson($id) {
	$app = \Slim\Slim::getInstance();
	$request = $app->request();
	$requestBody = $request->getBody();

	$requestData = json_decode($requestBody);

	$db = getConnection();

	$sql = "UPDATE persons SET ".
		"surname = '".(isset($requestData->surname) ? $requestData->surname : '')."', ".
		"surname_literal = '".(isset($requestData->surname_literal) ? $requestData->surname_literal : '')."', ".
		"firstname = '".(isset($requestData->firstname) ? $requestData->firstname : '')."', ".
		"gender = ".($requestData->gender == 'male' ? 0 : $requestData->gender == 'female' ? 1 : 'null').", ".
		"birth_day = ".(isset($requestData->birth) && isset($requestData->birth->day) ? $requestData->birth->day : 'null').", ".
		"birth_month = ".(isset($requestData->birth) && isset($requestData->birth->month) ? $requestData->birth->month : 'null').", ".
		"birth_year = ".(isset($requestData->birth) && isset($requestData->birth->year) ? $requestData->birth->year : 'null').", ".
		"death_day = ".(isset($requestData->death) && isset($requestData->death->day) ? $requestData->death->day : 'null').", ".
		"death_month = ".(isset($requestData->death) && isset($requestData->death->month) ? $requestData->death->month : 'null').", ".
		"death_year = ".(isset($requestData->death) && isset($requestData->death->year) ? $requestData->death->year : 'null')." ".
		"WHERE id = ".$id;

	$res = $db->query($sql);

	echo json_encode_is(array(
		'action' => 'putPerson',
		'status' => 'success'
	));

}

function putPlace($id) {
	$app = \Slim\Slim::getInstance();
	$request = $app->request();
	$requestBody = $request->getBody();

	$requestData = json_decode($requestBody);

	$db = getConnection();

	$updateQueries = array(
		"name = '".$requestData->name."'",
		"name_en = '".$requestData->name_en."'"
	);

	if (isset($requestData->area)) {
		array_push($updateQueries, "area = '".$requestData->area."'");
	}
	if (isset($requestData->area_en)) {
		array_push($updateQueries, "area_en = '".$requestData->area_en."'");
	}
	if (isset($requestData->lat)) {
		array_push($updateQueries, "lat = ".$requestData->lat);
	}
	if (isset($requestData->lng)) {
		array_push($updateQueries, "lng = ".$requestData->lng);
	}
	if (isset($requestData->google_id)) {
		array_push($updateQueries, "google_id = '".$requestData->google_id."'");
	}
	if (isset($requestData->google_location_type)) {
		array_push($updateQueries, "google_location_type = '".$requestData->google_location_type."'");
	}
	if (isset($requestData->google_name)) {
		array_push($updateQueries, "google_name = '".$requestData->google_name."'");
	}
	if (isset($requestData->google_address)) {
		array_push($updateQueries, "google_address_data = '".serialize($requestData->google_address)."'");
	}
	if (isset($requestData->commentary)) {
		array_push($updateQueries, "commentary = '".$requestData->commentary."'");
	}

	$sql = "UPDATE places SET ".implode(', ', $updateQueries)." WHERE id = ".$id;

	$res = $db->query($sql);

	echo json_encode_is(array(
		'action' => 'putPlace',
		'status' => 'success'
	));
}

function combinePlaces($finalId) {
	$ids = $_POST['ids'];

	$db = getConnection();

	foreach ($ids as $id) {
		$db->query('UPDATE persons SET birthplace = '.$finalId.' WHERE birthplace = '.$id);
		$db->query('UPDATE persons SET deathplace = '.$finalId.' WHERE deathplace = '.$id);

		$db->query('UPDATE documents SET birthplace = '.$finalId.' WHERE birthplace = '.$id);
		$db->query('UPDATE documents SET deathplace = '.$finalId.' WHERE deathplace = '.$id);

		$db->query('UPDATE personplaces SET place = '.$finalId.' WHERE place = '.$id);

		$db->query('UPDATE documentplaces SET place = '.$finalId.' WHERE place = '.$id);

		if ($id != $finalId) {
			$db->query('DELETE FROM places WHERE id = '.$id);
			$db->query('DELETE FROM personplaces WHERE place = '.$id);
			$db->query('DELETE FROM documentplaces WHERE place = '.$id);
		}
	}

	echo json_encode_is(array(
		'action' => 'combinePlaces',
		'status' => 'success'
	));
}

function combinePersons($finalId) {
	$ids = $_POST['ids'];

	$db = getConnection();


	foreach ($ids as $id) {
		$db->query('UPDATE persondocuments SET person = '.$finalId.' WHERE person = '.$id);
	
		if ($id != $finalId) {
			$db->query('DELETE FROM persons WHERE id = '.$id);
			$db->query('DELETE FROM personplaces WHERE person = '.$id);
		}
	}

	echo json_encode_is(array(
		'action' => 'combinePersons',
		'status' => 'success'
	));
}



// v2

function getMovementLocationsV2($yearFrom = null, $yearTo = null, $rangeType = null, $gender = null) {
	$condition = "";

	if (!is_null($rangeType) && $rangeType != "") {
		if ($rangeType == 'birth') {
			$condition = " AND persons.birth_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
		}
		else if ($rangeType == 'death') {
			$condition = " AND persons.death_year >= ".$yearFrom." AND persons.death_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
		}
		else {
			$condition = " AND persons.death_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
		}
	}
	else {
		$condition = " AND persons.death_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
	}

	if (!is_null($gender) && $gender != '') {
		if ($gender == 'male') {
			$condition .= " AND persons.gender = 0";
		}
		else if ($gender == 'female') {
			$condition .= " AND persons.gender = 1";
		}
	}

	$sql = "SELECT DISTINCT p1.id birthplace_id, p1.name birthplace_name, p1.area birthplace_area, p1.lat birthplace_lat, p1.lng birthplace_lng, p2.id deathplace_id, p2.name deathplace_name, p2.area deathplace_area, p2.lat deathplace_lat, p2.lng deathplace_lng FROM persons INNER JOIN places p1 ON persons.birthplace = p1.id INNER JOIN places p2 ON persons.deathplace = p2.id WHERE p1.id <> p2.id AND p1.lat IS NOT NULL AND p1.lng IS NOT NULL and p2.lat IS NOT NULL and p2.lng IS NOT NULL".$condition." ORDER BY p1.id";
	$db = getConnection();

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, array(
			'birthplace' => array(
				'id' => $row['birthplace_id'], 
				'name' => $row['birthplace_name'],
				'area' => $row['birthplace_area'],
				'lat' => $row['birthplace_lat'],
				'lng' => $row['birthplace_lng']
			),
			'deathplace' => array(
				'id' => $row['deathplace_id'], 
				'name' => $row['deathplace_name'],
				'area' => $row['deathplace_area'],
				'lat' => $row['deathplace_lat'],
				'lng' => $row['deathplace_lng']
			)
		));
	}
	echo json_encode_is($data, array('sql' => $sql));
}

function getLocationsV2($yearFrom = null, $yearTo = null, $rangeType = null, $relationType = null, $gender = null, $name = null) {
	$db = getConnection();

	$relationType = is_null($relationType) || $relationType == "" || $relationType == "both" ? "both" : $relationType;

	switch ($relationType) {
		case 'birth':
			$relationCriteria = " AND personplaces.relation = 'b'";
			break;
		case 'death':
			$relationCriteria = " AND personplaces.relation = 'd'	";
			break;
		case 'both':
			$relationCriteria = " ";
			break;
		default:
			$relationCriteria = " ";
	}

	if (!is_null($gender) && $gender != '') {
		if ($gender == 'male') {
			$genderCriteria = " AND persons.gender = 0";
		}
		else if ($gender == 'female') {
			$genderCriteria = " AND persons.gender = 1";
		}
		else {
			$genderCriteria = "";
		}
	}
	else {
		$genderCriteria = "";
	}

	if (!is_null($name) && $name != '') {
		$nameCriteria = " AND (LOWER(persons.surname) LIKE '%".
			mb_convert_case($name, MB_CASE_LOWER, "UTF-8").
		"%' OR LOWER(persons.surname_literal) LIKE '%".
			mb_convert_case($name, MB_CASE_LOWER, "UTF-8").
		"%' OR LOWER(persons.firstname) LIKE '%".
			mb_convert_case($name, MB_CASE_LOWER, "UTF-8").
		"%')";
	}
	else {
		$nameCriteria = "";
	}


	if (!is_null($yearFrom) && $yearFrom != "" && !is_null($yearTo) && $yearTo != "") {
		if (!is_null($rangeType) && $rangeType != "") {
			if ($rangeType == 'birth') {
				$rangeCriteria = " AND persons.birth_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
			}
			else if ($rangeType == 'death') {
				$rangeCriteria = " AND persons.death_year >= ".$yearFrom." AND persons.death_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
			}
			else {
				$rangeCriteria = " AND persons.death_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
			}
		}
		else {
			$rangeCriteria = " AND persons.death_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year";
		}
	}
	else {
		$rangeCriteria = " ";
	}

	$sql = "SELECT DISTINCT places.id, places.name, places.area, places.lat, places.lng, Count(persons.id) AS c FROM places INNER JOIN personplaces ON personplaces.place = places.id INNER JOIN persons ON personplaces.person = persons.id".
		" WHERE places.lat IS NOT NULL AND places.lng IS NOT NULL".
		$relationCriteria.
		$rangeCriteria.
		$genderCriteria.
		$nameCriteria.
		" GROUP BY places.id"
	;

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, $row);
	}
	echo json_encode_is($data, array('sql' => $sql));
}

function getPersonsV2($yearFrom = null, $yearTo = null, $rangeType = null, $gender = null, $name = null, $page = 0) {
	$pageSize = 40;

	$db = getConnection();

	$criteras = array();
	if (!is_null($gender) && $gender != '') {
		if ($gender == 'male') {
			array_push($criteras, "persons.gender = 0");
		}
		else if ($gender == 'female') {
			array_push($criteras, "persons.gender = 1");
		}
	}

	if (!is_null($name) && $name != '') {
		array_push($criteras, "(LOWER(persons.surname) LIKE '%".
			mb_convert_case($name, MB_CASE_LOWER, "UTF-8").
		"%' OR LOWER(persons.surname_literal) LIKE '%".
			mb_convert_case($name, MB_CASE_LOWER, "UTF-8").
		"%' OR LOWER(persons.firstname) LIKE '%".
			mb_convert_case($name, MB_CASE_LOWER, "UTF-8").
		"%')");
	}


	if (!is_null($yearFrom) && $yearFrom != "" && !is_null($yearTo) && $yearTo != "") {
		if (!is_null($rangeType) && $rangeType != "") {
			if ($rangeType == 'birth') {
				array_push($criteras, "persons.birth_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year");
			}
			else if ($rangeType == 'death') {
				array_push($criteras, "persons.death_year >= ".$yearFrom." AND persons.death_year <= ".$yearTo." AND persons.birth_year < persons.death_year");
			}
			else {
				array_push($criteras, "persons.death_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year");
			}
		}
		else {
			array_push($criteras, "persons.death_year >= ".$yearFrom." AND persons.birth_year <= ".$yearTo." AND persons.birth_year < persons.death_year");
		}
	}


	$sql = "SELECT SQL_CALC_FOUND_ROWS persons.id, ".
		"persons.ll_id, ".
		"persons.ll_idnum, ".
		"persons.surname, ".
		"persons.surname_literal, ".
		"persons.firstname, ".
		"persons.gender, ".
		"persons.birthplace, ".
		"persons.deathplace, ".
		"persons.birth_day, ".
		"persons.birth_month, ".
		"persons.birth_year, persons.death_day, ".
		"persons.death_month, ".
		"persons.death_year, ".
		"b_p.name birthplacename, ".
		"b_p.area birthplacearea, ".
		"b_p.lat birthplacelat, ".
		"b_p.lng birthplacelng, ".
		"d_p.name deathplacename, ".
		"d_p.area deathplacearea, ".
		"d_p.lat deathplacelat, ".
		"d_p.lng deathplacelng FROM persons LEFT JOIN places b_p ON persons.birthplace = b_p.id LEFT JOIN places d_p ON persons.deathplace = d_p.id ".
		"WHERE ".implode(' AND ', $criteras)." ".
		"LIMIT ".$page.", ".$pageSize
	;

	$res = $db->query($sql);
	
	$data = array();
	while ($row = $res->fetch_assoc()) {
		array_push($data, $row);
	}

	$res = $db->query('SELECT FOUND_ROWS() total');
	$row = $res->fetch_assoc();

	echo json_encode_is($data, array(
		'sql' => $sql,
		'page' => $page+$pageSize,
		'total' => $row['total']
	));
}

?>