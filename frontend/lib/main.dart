import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend/appointment/bloc/appointment_bloc.dart';
import 'package:frontend/appointment/bloc/appointment_event.dart';
import 'package:frontend/appointment/screens/main_window.dart';

import 'appointment/bloc/appointment_state.dart';
import 'appointment/models/appointment_model.dart';

const String imageUrl =
    'https://staging-avatars.rosa.be/hps/61379ba159d4940022b6c91f/hp-profile-picture-a1e9e186-d0ba-484e-a9f8-cad9383c4e9f.png';
const String speciality = 'Ophtalmologue';
const String name = 'Antoine Pairet';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AppointmentBloc>(
          create: (context) => AppointmentBloc(),
        ),
      ],
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const MyHomePage(),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late List<AppointmentModel> appointments;

  @override
  void initState() {
    super.initState();
    appointments = BlocProvider.of<AppointmentBloc>(context).appointments;
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener(
      bloc: BlocProvider.of<AppointmentBloc>(context),
      listener: (context, state) {
        if (state is AppointmentState) {
          setState(() {
            appointments =
                BlocProvider.of<AppointmentBloc>(context).appointments;
          });
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: titleWidget(),
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Flexible(
              flex: 1,
              child: Center(
                child: TextButton(
                  onPressed: () {
                    BlocProvider.of<AppointmentBloc>(context).add(
                      StartAppointmentEvent(),
                    );
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const MainAppointmentWindow(),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        vertical: 10, horizontal: 20),
                    color: Theme.of(context).primaryColor,
                    child: const Text(
                      'Prendre Rendez-vous',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              flex: 6,
              child: Column(
                children: appointments
                    .map(
                      (appointment) => appointmentCard(appointment),
                    )
                    .toList(),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget appointmentCard(AppointmentModel appointment) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      child: Row(
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
              const Text(
                'Rendez-Vous avec Antoine Pairet',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Row(
                children: [
                  Text(
                    appointment.reason,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 5),
                  const Text(' - '),
                  const SizedBox(width: 5),
                  Text(
                    'Le ${appointment.date.day}/${appointment.date.month} à ${appointment.date.hour}:${appointment.date.minute}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                ],
              ),
              Text(
                appointment.address,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.normal,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget titleWidget() {
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
          children: const [
            Text(
              name,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              speciality,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
