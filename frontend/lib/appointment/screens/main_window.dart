import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend/appointment/bloc/appointment_bloc.dart';
import 'package:frontend/appointment/bloc/appointment_event.dart';
import 'package:frontend/appointment/screens/choose_location.dart';
import 'package:frontend/appointment/screens/first_meeting.dart';
import 'package:frontend/appointment/screens/why_visit.dart';

import 'calendar_view.dart';

class MainAppointmentWindow extends StatefulWidget {
  const MainAppointmentWindow({super.key});

  @override
  State<MainAppointmentWindow> createState() => _MainAppointmentWindowState();
}

class _MainAppointmentWindowState extends State<MainAppointmentWindow>
    with SingleTickerProviderStateMixin {
  final String title = 'Choisissez un emplacement';
  final String notAvailable = 'Aucune disponibilité en ligne';
  final String prendreRendezVous = 'Prendre rendez-vous avec';
  final String name = 'Antoine Pairet';

  late final List<Widget> listTabBarView;

  late TabController tabController;
  var scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    listTabBarView = [
      ChooseLocationPage(setIndex: setIndex),
      FirstMeetingPage(setIndex: setIndex),
      WhyVisitPage(setIndex: setIndex),
      CalendarPage(setIndex: setIndex),
    ];
    tabController = TabController(length: listTabBarView.length, vsync: this);
    tabController.addListener(_handleTabSelection);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: topTitleWidget(),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            onPressed: () {
              BlocProvider.of<AppointmentBloc>(context).add(
                CloseAppointmentEvent(),
              );
              Navigator.pop(context);
            },
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: SafeArea(
        child: TabBarView(
          controller: tabController,
          children: listTabBarView,
        ),
      ),
    );
  }

  Widget topTitleWidget() {
    // Create a title widget with a circle avatar and a text widget
    return Row(
      children: [
        const CircleAvatar(
          radius: 25,
          backgroundImage:
              ExactAssetImage('assets/images/hp-profile-picture.png'),
        ),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              prendreRendezVous,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
            ),
            Text(
              name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }

  void setIndex(int index) {
    setState(() {
      tabController.index = index;
    });
  }

  void _handleTabSelection() {
    // Add all changes needed when changing tabs
    setState(() {});
  }
}
