function AutorCtrl($scope, Data, $cookieStore) {
  Data.prepForBroadcast($cookieStore.get('profesor'));
  Data.changeActiveListItem('autor');
  Data = $cookieStore.get('Data');  
}