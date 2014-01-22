function AutorCtrl($scope, Data, $cookieStore) {
  Data.prepForBroadcast($cookieStore.get('profesor'));
  Data = $cookieStore.get('Data');  
}