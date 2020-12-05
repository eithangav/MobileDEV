package com.example.peakyblinders;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void pushShelby(View view){
        Intent intent = new Intent(this, ShelbyPageActivity.class);
        startActivity(intent);
    }

    public void pushStark(View view){
        Intent intent = new Intent(this, StarkPageActivity.class);
        startActivity(intent);
    }
}