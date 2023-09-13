class LocationModel {
  final String name;
  final String address;
  final bool isAvailable;

  LocationModel({
    required this.name,
    required this.address,
    this.isAvailable = true,
  });
}
