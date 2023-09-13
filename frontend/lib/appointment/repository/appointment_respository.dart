import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class AppointmentRepository {
  static const String getAvailabilitiesUrl =
      'https://staging-patient-booking.rosa.be/fr/booking/hp/antoine-staging-pairet/availability/q-data.json?site=61379ba159d4940022b6c926&is-new-patient=true&motive=61379ba159d4940022b6c929';

  Future<List<DateTime>> getAllAvailabilities() async {
    try {
      List<DateTime> availabilities = [];
      var res = await fetchData(getAvailabilitiesUrl);
      if (res != null) {
        for (var item in res['_objs']) {
          if (item.toString().length > 13) {
            DateTime? tempDate =
                DateTime.tryParse(item.toString().substring(1));
            if (tempDate != null) {
              availabilities.add(tempDate);
            }
          }
        }
      }
      availabilities.sort();
      availabilities.toSet().toList();
      return availabilities;
    } catch (e) {
      rethrow;
    }
  }
}

Future<dynamic> fetchData(String uri) async {
  final url = Uri.parse(uri);
  try {
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      if (kDebugMode) {
        print('Request failed with status: ${response.statusCode}');
      }
    }
  } catch (e) {
    // Handle any exceptions that occur
    if (kDebugMode) {
      print('Error: $e');
    }
  }
}
